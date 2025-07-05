import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlueskyFeedData } from '@/components/bluesky/types';

export const useBlueskyFeed = () => {
  const [feedData, setFeedData] = useState<BlueskyFeedData>({ posts: [] });
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    console.log('🔍 BlueskyFeed useEffect triggered');
    
    const fetchBlueskyFeed = async () => {
      console.log('🚀 Starting Bluesky feed fetch...');
      
      // Enhanced retry mechanism with exponential backoff
      const maxRetries = 3;
      let lastError: any = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`📡 Attempt ${attempt}/${maxRetries} - Fetching Bluesky feed...`);
          
          const cacheBust = Date.now();
          const requestBody = { cacheBust };
          
          // Create AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          try {
            console.log('🔄 Using Supabase client method...');
            
            const { data, error } = await supabase.functions.invoke('bluesky-feed', {
              body: requestBody
            });
            
            clearTimeout(timeoutId);
            
            if (error) {
              console.error('🚨 Function returned error:', error);
              setFeedData({ 
                posts: [], 
                error: `Function error: ${error.message || JSON.stringify(error)}`
              });
              setDebugInfo({ 
                type: 'function_error', 
                error: error.message || JSON.stringify(error),
                attempt,
                timestamp: new Date().toISOString()
              });
            } else if (data && data.error) {
              console.error('🚨 API returned error:', data.error);
              setFeedData({ 
                posts: [], 
                error: `API error: ${data.error}`
              });
              setDebugInfo({ 
                type: 'api_error', 
                error: data.error,
                attempt,
                timestamp: new Date().toISOString()
              });
            } else if (data && data.posts) {
              console.log(`🎉 Success on attempt ${attempt}! Posts loaded:`, data.posts.length);
              setFeedData(data);
              setDebugInfo({ 
                type: 'success', 
                debug: data.debug,
                postsCount: data.posts?.length || 0,
                attempt,
                timestamp: new Date().toISOString()
              });
            } else {
              console.error('🚨 No valid data received');
              setFeedData({ 
                posts: [], 
                error: 'No data received from function'
              });
              setDebugInfo({ 
                type: 'no_data', 
                error: 'No data received',
                attempt,
                timestamp: new Date().toISOString()
              });
            }
            
            // Success! Break out of retry loop
            break;
            
          } catch (fetchError: any) {
            clearTimeout(timeoutId);
            console.error(`💥 Attempt ${attempt} failed:`, fetchError.message);
            
            if (attempt < maxRetries) {
              // Exponential backoff: wait longer between retries
              const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
              console.log(`⏳ Waiting ${delay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              // Final attempt failed
              console.error('💥 All retry attempts failed');
              const errorMessage = fetchError.message || 'Unknown error';
              setFeedData({ 
                posts: [], 
                error: `Network error: ${errorMessage}`
              });
              setDebugInfo({ 
                type: 'network_error', 
                error: errorMessage,
                totalAttempts: maxRetries,
                timestamp: new Date().toISOString()
              });
            }
          }
          
        } catch (error: any) {
          lastError = error;
          console.error(`💥 Attempt ${attempt} failed:`, error.message);
          
          if (attempt < maxRetries) {
            // Exponential backoff: wait longer between retries
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`⏳ Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // Final attempt failed
            console.error('💥 All retry attempts failed');
            const errorMessage = error.message || 'Unknown error';
            setFeedData({ 
              posts: [], 
              error: `Network error: ${errorMessage}`
            });
            setDebugInfo({ 
              type: 'network_error', 
              error: errorMessage,
              totalAttempts: maxRetries,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
      
      setLoading(false);
    };

    fetchBlueskyFeed();
  }, []);

  return { feedData, loading, debugInfo };
};
