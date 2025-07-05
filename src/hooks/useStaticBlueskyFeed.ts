import { useState, useEffect } from 'react';
import { BlueskyFeedData } from '@/components/bluesky/types';

export const useStaticBlueskyFeed = () => {
  const [feedData, setFeedData] = useState<BlueskyFeedData>({ posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaticBlueskyFeed = async () => {
      try {
        console.log('📡 Loading static Bluesky feed...');
        
        // Fetch the static JSON file
        const response = await fetch('/data/bluesky-feed.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load Bluesky feed: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log(`✅ Loaded static Bluesky feed with ${data.posts?.length || 0} posts`);
        
        setFeedData(data);
        setError(null);
        
      } catch (err) {
        console.error('❌ Failed to load static Bluesky feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Bluesky feed');
        setFeedData({ posts: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchStaticBlueskyFeed();
  }, []);

  return { feedData, loading, error };
}; 