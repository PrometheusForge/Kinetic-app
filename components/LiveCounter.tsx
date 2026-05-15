"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LiveCounter() {
  const [inventory, setInventory] = useState(48); // Fallback

  useEffect(() => {
    // 1. Fetch initial inventory on load
    const fetchInventory = async () => {
      const { data } = await supabase.from('products').select('inventory_count').eq('id', 'kinetic_base').single();
      if (data) setInventory(data.inventory_count);
    };
    fetchInventory();

    // 2. Subscribe to real-time changes
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          // When someone buys, this updates instantly for all visitors
          setInventory(payload.new.inventory_count);
        }
      )
      .subscribe();

    // 3. Cleanup function to prevent memory leaks
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex gap-4 border p-4 bg-gray-900 text-white font-mono">
      <div>{inventory} Units remaining in Batch 04</div>
    </div>
  );
}
