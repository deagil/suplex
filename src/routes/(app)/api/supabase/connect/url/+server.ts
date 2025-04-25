// src/routes/api/supabse/connect/url/+server.ts
import { OAUTH_CLIENT_ID, OAUTH_REDIRECT_URI } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { randomBytes, createHash } from 'crypto';

const AUTH_URL = 'https://api.supabase.com/v1/oauth/authorize';
const RESPONSE_TYPE = 'code';
const CODE_CHALLENGE_METHOD = 'S256';

function base64URLEncode(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer: string): Buffer {
  return createHash('sha256').update(buffer).digest();
}

export async function GET({ cookies }) {
  // Generate a random code verifier
  const codeVerifier = base64URLEncode(randomBytes(32));
  // Generate the code challenge
  const codeChallenge = base64URLEncode(sha256(codeVerifier));

  // Store the codeVerifier in a cookie (or your preferred session mechanism)
  cookies.set('code_verifier', codeVerifier, { path: '/', httpOnly: true, secure: true });

  // Generate and store a state parameter
  const state = base64URLEncode(randomBytes(16));
  cookies.set('oauth_state', state, { path: '/', httpOnly: true, secure: true });

  // Construct the authorization URL
  const url = new URL(AUTH_URL);
  url.searchParams.append('client_id', OAUTH_CLIENT_ID);
  url.searchParams.append('redirect_uri', OAUTH_REDIRECT_URI);
  url.searchParams.append('response_type', RESPONSE_TYPE);
  url.searchParams.append('code_challenge', codeChallenge);
  url.searchParams.append('code_challenge_method', CODE_CHALLENGE_METHOD);
  url.searchParams.append('state', state);

  return json({ authorizationUrl: url.toString() });
}