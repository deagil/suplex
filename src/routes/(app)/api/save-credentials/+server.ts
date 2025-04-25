// src/routes/api/save-credentials/+server.js
import { json } from '@sveltejs/kit';
import { encrypt, decrypt } from '$lib/crypto';
import type { RequestHandler } from '@sveltejs/kit';

export async function POST({ request, locals }) {
  try {
    const { app, config } = await request.json();

    //console.log('Received app:', app);
    //console.log('Received config:', config);

    if (!config) {
      throw new Error('Config is undefined.');
    }

    // Get the user ID from the session
    const user = locals.user;
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user_id = user.id;

    // Encrypt the credentials
    const encryptedCredentials = encrypt(JSON.stringify(config));

    // Insert into the database using locals.supabaseServiceRole
    const { error } = await locals.supabaseServiceRole
      .from('user_services')
      .upsert({
        user_id,
        app,
        config: encryptedCredentials,
      });

    if (error) {
      console.error('Database error:', error);
      return json({ error: error.message }, { status: 500 });
    }

    return json({ message: 'Config saved successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

// export async function GET({ request, locals }) {
//   try {
//     const { user, supabaseServiceRole } = locals;
//     const { app } = await request.json();

//     console.log('Received app:', app);

//     if (!app) {
//       return json({ error: 'Missing app parameter' }, { status: 400 });
//     }

//     if (!user) {
//       return json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { data, error } = await supabaseServiceRole
//       .from('user_services')
//       .select('config')
//       .eq('user_id', user.id)
//       .eq('app', app)
//       .single();

//     if (error || !data) {
//       return json({ error: 'No config found' }, { status: 404 });
//     }

//     const decryptedConfig = JSON.parse(decrypt(data.config));
//     console.log('Decrypted config:', decryptedConfig);

//     return json({ config: decryptedConfig });
//   } catch (error) {
//     console.error('Server error:', error);
//     return json({ error: 'Server error' }, { status: 500 });
//   }
// }

export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const { user, supabaseServiceRole } = locals;

    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract the "app" parameter from the query string
    const app = url.searchParams.get('app');
    if (!app) {
      return json({ error: 'Missing app parameter' }, { status: 400 });
    }

    // Query the database for the given user's service config for the specified app
    const { data, error } = await supabaseServiceRole
      .from('user_services')
      .select('config')
      .eq('user_id', user.id)
      .eq('app', app)
      .single();

    if (error || !data) {
      return json({ error: 'No config found' }, { status: 404 });
    }

    // Decrypt the stored configuration
    const decryptedConfig = JSON.parse(decrypt(data.config));

    return json({ config: decryptedConfig });
  } catch (error: any) {
    console.error('Server error:', error);
    return json({ error: error.message || 'Server error' }, { status: 500 });
  }
};