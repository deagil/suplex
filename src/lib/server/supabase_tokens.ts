
// Helper to get and refresh the user's Supabase Management API access token
export async function getUserSupabaseAccessToken(locals: App.Locals): Promise<string | null> {
    const supabase = locals.supabase;
    const sessionData = await locals.safeGetSession();
    const userId = sessionData.user?.id;
    const debug = true;

    if (!userId) {
        if (debug) {
            console.log('No user ID found in session data.');
        }
        return null;
    }

    // Fetch token info from your DB
    const { data, error } = await supabase
        .from('user_services')
        .select('config')
        .eq('user_id', userId)
        .eq('app', 'supabase_token')
        .single();

    if (error || !data) {
        if (debug) {
            console.log('Error fetching Supabase token:', error);
        }
        return null;
    }

    if (debug) {
        console.log('Supabase token data:', data);
    }

    const config = data.config;
    /**
     * config: {
        expires_in: 86400,
        token_type: 'Bearer',
        access_token: 'sbp_oauth_84d956bdea82af48de9c7ae3b3a596f45611356e',
        refresh_token: 'hAXaEduIYbvpMPwEVA'
    }
     */

    const now = Math.floor(Date.now() / 1000);

    // If token is still valid, return it

    if (config.expires_at && config.expires_at > now + 60) {
        if (debug) {
            console.log('Supabase token is still valid.');
        }
        return config.access_token;
    }

    // If expired, refresh it
    if (config.refresh_token) {
        if (debug) {
            console.log('Supabase token expired, refreshing...');
        }
        const clientId = process.env.SUPABASE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.SUPABASE_OAUTH_CLIENT_SECRET;
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', config.refresh_token);

        const res = await fetch('https://api.supabase.com/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`
            },
            body: params.toString()
        });
        if (debug) {
            console.log('Supabase token refresh response:', res);
        }
        if (res.ok) {
            const tokens = await res.json();
            const newExpiresAt = now + (tokens.expires_in ?? 3600);

            // Save new tokens to DB
            await supabase
                .from('user_services')
                .update({
                    config: {
                        ...tokens,
                        expires_at: newExpiresAt
                    }
                })
                .eq('user_id', userId)
                .eq('app', 'supabase_token');

            return tokens.access_token;
        }
    }

    return null;
}