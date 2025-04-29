// src/routes/api/supabase/connect/callback/+server.ts
import { OAUTH_REDIRECT_URI, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from '$env/static/private';
import { redirect, error } from '@sveltejs/kit';
import { btoa } from 'buffer';

const TOKEN_URL = 'https://api.supabase.com/v1/oauth/token';

export async function GET(event) {
  const { url, cookies, fetch, locals } = event;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const supabase = locals.supabase;

  // Validate that we received the necessary parameters
  if (!code || !state) {
    throw error(400, 'Missing code or state');
  }

  // Validate the state parameter against what was stored
  const storedState = cookies.get('oauth_state');
  if (state !== storedState) {
    throw error(400, 'Invalid state');
  }

  // Retrieve the stored code verifier
  const codeVerifier = cookies.get('code_verifier');
  if (!codeVerifier) {
    throw error(400, 'Missing code verifier');
  }

  // Build the parameters for token exchange
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', OAUTH_REDIRECT_URI);
  params.append('code_verifier', codeVerifier);

  // Use basic auth to include your client credentials
  const basicAuth = btoa(`${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`);

  // Exchange the authorization code for tokens
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`
    },
    body: params.toString()
  });

  if (!res.ok) {
    throw error(res.status, 'Failed to exchange code for tokens');
  }

  const tokens = await res.json();

  // TODO: Save the tokens in your database and update the user's profile to mark them as connected.
  // console.log('Received tokens:', tokens);
  const sessionData = await locals.safeGetSession();
  const userId = sessionData.user?.id;
  if (userId) {
    const now = Math.floor(Date.now() / 1000);
    const expires_at = now + tokens.expires_in; // expires_in is seconds from now
    const { data, error: dbError } = await supabase
      .from('user_services')
      .upsert({
        user_id: userId,
        app: 'supabase_token',
        config: {
          ...tokens,
          expires_at
        }
      });

    if (dbError) {
      // console.error('Error saving tokens:', dbError);
      throw error(500, 'Failed to save tokens');
    }

    if (data) {
      // console.log('Tokens saved successfully:', data);
    }
  }

  // Optionally, you can also store the tokens in a secure cookie or session
  // cookies.set('supabase_token', tokens.access_token, { path: '/' });

  // Optionally clear the cookies
  cookies.delete('code_verifier', { path: '/' });
  cookies.delete('oauth_state', { path: '/' });

  // Redirect the user to the next onboarding step (e.g., plan selection)
  throw redirect(303, '/integrations/supabase');
}