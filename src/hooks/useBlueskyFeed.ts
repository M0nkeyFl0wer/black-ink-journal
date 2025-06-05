
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
          
          let data, error;
          
          try {
            // Primary method: Direct fetch with proper authentication
            console.log('🔄 Using direct fetch method...');
            
            const response = await fetch('https://jfsvlaaposslmeneovtp.supabase.co/functions/v1/bluesky-feed', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4`,
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4'
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log(`✅ Direct fetch response status: ${response.status}`);
            
            if (response.ok) {
              data = await response.json();
              error = null;
              console.log('🎉 Direct fetch successful!');
            } else {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
          } catch (fetchError: any) {
            clearTimeout(timeoutId);
            console.log(`⚠️ Direct fetch failed (attempt ${attempt}):`, fetchError.message);
            
            // If it's an abort error, don't retry immediately
            if (fetchError.name === 'AbortError') {
              throw new Error('Request timeout - function took too long to respond');
            }
            
            // For other errors, try Supabase client as fallback on final attempt
            if (attempt === maxRetries) {
              console.log('🔄 Trying Supabase client as final fallback...');
              
              try {
                const supabaseResponse = await supabase.functions.invoke('bluesky-feed', {
                  body: requestBody
                });
                
                data = supabaseResponse.data;
                error = supabaseResponse.error;
                
                console.log('✅ Supabase client fallback successful');
                
              } catch (supabaseError: any) {
                console.error('❌ Supabase client fallback also failed:', supabaseError);
                throw fetchError; // Throw the original fetch error
              }
            } else {
              throw fetchError; // Let it retry with direct fetch
            }
          }
          
          // Process successful response
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
