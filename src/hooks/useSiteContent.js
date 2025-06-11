import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

const useSiteContent = (keys) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = cache.get(keys.join(','));
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setContent(cachedData.data);
          setLoading(false);
          return;
        }
      }

      let query = supabase.from('site_content').select('content_key, content_value');
      
      if (keys && keys.length > 0) {
        query = query.in('content_key', keys);
      }

      const { data, error: dbError } = await query;
      
      if (dbError) throw dbError;

      const fetchedContent = {};
      if (data) {
        data.forEach(item => {
          fetchedContent[item.content_key] = item.content_value;
        });
      }

      // Fill missing keys with default values
      if (keys && keys.length > 0) {
        keys.forEach(key => {
          if (!fetchedContent.hasOwnProperty(key)) {
            fetchedContent[key] = '';
          }
        });
      }

      // Update cache
      cache.set(keys.join(','), {
        data: fetchedContent,
        timestamp: Date.now()
      });

      setContent(fetchedContent);
    } catch (err) {
      console.error("Error fetching site content:", err);
      setError(err);
      
      // Set default values on error
      if (keys && keys.length > 0) {
        const defaultContent = keys.reduce((acc, key) => ({ ...acc, [key]: '' }), {});
        setContent(defaultContent);
      }
    } finally {
      setLoading(false);
    }
  }, [keys]);

  useEffect(() => {
    fetchContent();

    // Set up real-time subscription
    const channel = supabase.channel('site_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content',
        },
        (payload) => {
          // Update local content when changes occur
          setContent(prevContent => {
            const newContent = { ...prevContent };
            if (payload.new) {
              newContent[payload.new.content_key] = payload.new.content_value;
            }
            return newContent;
          });

          // Invalidate cache
          cache.delete(keys.join(','));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [keys, fetchContent]);

  const updateContent = useCallback(async (key, value) => {
    try {
      const { error: updateError } = await supabase
        .from('site_content')
        .upsert({
          content_key: key,
          content_value: value,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      // Update local content immediately
      setContent(prev => ({
        ...prev,
        [key]: value
      }));

      // Invalidate cache
      cache.delete(keys.join(','));

      return true;
    } catch (err) {
      console.error("Error updating content:", err);
      setError(err);
      return false;
    }
  }, [keys]);

  const refetch = useCallback(() => {
    return fetchContent(true);
  }, [fetchContent]);

  return { content, loading, error, updateContent, refetch };
};

export default useSiteContent;
