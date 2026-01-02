// Supabase client for production database
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

// Get the Supabase client instance (singleton pattern)
export const useSupabase = () => {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};

// Helper function for SELECT queries
export const supabaseQueryAll = async <T = any>(
  table: string,
  options?: {
    select?: string;
    filter?: { column: string; value: any }[];
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }
): Promise<T[]> => {
  const client = useSupabase();
  let query = client.from(table).select(options?.select || '*');

  if (options?.filter) {
    for (const f of options.filter) {
      query = query.eq(f.column, f.value);
    }
  }

  if (options?.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }

  return (data || []) as T[];
};

// Helper function for SELECT single row
export const supabaseQueryOne = async <T = any>(
  table: string,
  options?: {
    select?: string;
    filter?: { column: string; value: any }[];
  }
): Promise<T | null> => {
  const client = useSupabase();
  let query = client.from(table).select(options?.select || '*');

  if (options?.filter) {
    for (const f of options.filter) {
      query = query.eq(f.column, f.value);
    }
  }

  const { data, error } = await query.limit(1).single();

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase query error:', error);
    throw error;
  }

  return data as T | null;
};

// Helper function for INSERT
export const supabaseInsert = async <T = any>(
  table: string,
  data: Partial<T> | Partial<T>[]
): Promise<T[]> => {
  const client = useSupabase();
  const { data: result, error } = await client.from(table).insert(data).select();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }

  return (result || []) as T[];
};

// Helper function for UPDATE
export const supabaseUpdate = async <T = any>(
  table: string,
  data: Partial<T>,
  filter: { column: string; value: any }[]
): Promise<T[]> => {
  const client = useSupabase();
  let query = client.from(table).update(data);

  for (const f of filter) {
    query = query.eq(f.column, f.value);
  }

  const { data: result, error } = await query.select();

  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }

  return (result || []) as T[];
};

// Helper function for DELETE
export const supabaseDelete = async (
  table: string,
  filter: { column: string; value: any }[]
): Promise<void> => {
  const client = useSupabase();
  let query = client.from(table).delete();

  for (const f of filter) {
    query = query.eq(f.column, f.value);
  }

  const { error } = await query;

  if (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
};

// Raw SQL query using Supabase RPC (you need to create a function in Supabase for this)
export const supabaseRawQuery = async <T = any>(
  sql: string,
  params?: Record<string, any>
): Promise<T[]> => {
  const client = useSupabase();
  const { data, error } = await client.rpc('raw_query', { query_text: sql, ...params });

  if (error) {
    console.error('Supabase raw query error:', error);
    throw error;
  }

  return (data || []) as T[];
};
