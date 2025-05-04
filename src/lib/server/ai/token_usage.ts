import type { SupabaseClient } from '@supabase/supabase-js';

export async function logAIUsage({
    supabase,
    userId,
    feature,
    costUsd,
    tokens,
    model,
    metadata = {},
}: {
    supabase: SupabaseClient<any, any, any>;
    userId: string;
    feature: string;
    costUsd: number;
    tokens: number;
    model: string;
    metadata?: Record<string, any>;
}) {
    return supabase.from('ai_usage').insert([
        {
            user_id: userId,
            feature,
            cost_usd: costUsd,
            tokens,
            model,
            metadata,
        },
    ]);
}