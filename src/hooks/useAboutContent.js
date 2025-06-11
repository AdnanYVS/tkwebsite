import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Cache object to store fetched content
const cache = {
  data: null,
  timestamp: null,
};

export default function useAboutContent(contentKeys) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      // Check if we have valid cached data
      if (cache.data && cache.timestamp && Date.now() - cache.timestamp < CACHE_DURATION) {
        setContent(cache.data);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('about_page_content')
        .select('content_key, content_value')
        .in('content_key', contentKeys);

      if (error) throw error;

      // Transform the data into an object
      const contentObject = data.reduce((acc, item) => {
        acc[item.content_key] = item.content_value;
        return acc;
      }, {});

      // Update cache
      cache.data = contentObject;
      cache.timestamp = Date.now();

      setContent(contentObject);
      setError(null);
    } catch (err) {
      console.error('Error fetching about page content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contentKeys]);

  useEffect(() => {
    fetchContent();

    // Set up real-time subscription
    const subscription = supabase
      .channel('about_page_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about_page_content',
        },
        () => {
          // Invalidate cache and refetch data
          cache.data = null;
          cache.timestamp = null;
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchContent]);

  const updateContent = useCallback(async (updates) => {
    try {
      setLoading(true);
      const updatesArray = Object.entries(updates).map(([key, value]) => ({
        content_key: key,
        content_value: value,
      }));

      const { error } = await supabase
        .from('about_page_content')
        .upsert(updatesArray, { onConflict: 'content_key' });

      if (error) throw error;

      // Update local state immediately
      setContent((prev) => ({ ...prev, ...updates }));

      // Invalidate cache
      cache.data = null;
      cache.timestamp = null;

      return true;
    } catch (err) {
      console.error('Error updating about page content:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    cache.data = null;
    cache.timestamp = null;
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    updateContent,
    refetch,
  };
} 