import { useEffect } from 'react';
import supabase from './supabaseClient';

/**
 * A hook to subscribe to Supabase Realtime changes
 * 
 * @param {string} table - The table to subscribe to (e.g. 'page_sections', 'projects')
 * @param {function} callback - Function to call when data changes
 * @param {string} event - The event type to listen for ('INSERT', 'UPDATE', 'DELETE', '*')
 * @param {Object} filter - Optional filter for the subscription
 */
export default function useRealtimeSubscription(table, callback, event = '*', filter = {}) {
  useEffect(() => {
    // Create a channel with a filter
    const channel = supabase
      .channel(`changes_to_${table}`)
      .on(
        'postgres_changes',
        {
          event: event,
          schema: 'public',
          table: table,
          ...filter
        },
        (payload) => {
          // Call the callback with the payload
          callback(payload);
        }
      )
      .subscribe();

    // Cleanup: remove the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, event, JSON.stringify(filter)]);
} 