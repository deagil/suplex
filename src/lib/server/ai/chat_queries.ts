// Adjust table/column names as needed.
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Chat {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    visibility: 'private' | 'public';
}

export interface Message {
    id: string;
    chat_id: string;
    role: 'user' | 'assistant' | string;
    parts: any; // define a stricter type if needed
    attachments: any[];
    created_at: string;
}

export async function getChatsByUserId({
    supabaseClient,
    id,
}: {
    supabaseClient: SupabaseClient;
    id: string;
}): Promise<Chat[]> {
    const { data, error } = await supabaseClient
        .from('chats')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Chat[];
}

export async function getChatById({
    supabaseClient,
    id,
}: {
    supabaseClient: SupabaseClient;
    id: string;
}): Promise<Chat> {
    const { data, error } = await supabaseClient
        .from('chats')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw new Error(error.message);
    return data as Chat;
}

export async function saveChat({
    supabaseClient,
    id,
    userId,
    title,
}: {
    supabaseClient: SupabaseClient;
    id: string;
    userId: string;
    title: string;
}): Promise<Chat> {
    const { data, error } = await supabaseClient
        .from('chats')
        .insert({
            id,
            user_id: userId,
            title,
            created_at: new Date().toISOString(),
            visibility: 'private',
        })
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as Chat;
}

export async function deleteChatById({
    supabaseClient,
    id,
}: {
    supabaseClient: SupabaseClient;
    id: string;
}): Promise<void> {
    // Delete related votes and messages first.
    const { error: voteError } = await supabaseClient
        .from('votes')
        .delete()
        .eq('chat_id', id);
    if (voteError) throw new Error(voteError.message);

    const { error: messageError } = await supabaseClient
        .from('messages')
        .delete()
        .eq('chat_id', id);
    if (messageError) throw new Error(messageError.message);

    const { error: chatError } = await supabaseClient
        .from('chats')
        .delete()
        .eq('id', id);
    if (chatError) throw new Error(chatError.message);
}

export async function saveMessages({
    supabaseClient,
    messages,
}: {
    supabaseClient: SupabaseClient;
    messages: Message[];
}): Promise<Message[]> {
    const { data, error } = await supabaseClient
        .from('messages')
        .insert(messages)
        .select();
    if (error) throw new Error(error.message);
    return data as Message[];
}

export async function getMessagesByChatId({
    supabaseClient,
    id,
}: {
    supabaseClient: SupabaseClient;
    id: string;
}): Promise<Message[]> {
    const { data, error } = await supabaseClient
        .from('messages')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data as Message[];
}

export async function voteMessage({
    supabaseClient,
    chatId,
    messageId,
    type,
}: {
    supabaseClient: SupabaseClient;
    chatId: string;
    messageId: string;
    type: 'up' | 'down';
}): Promise<void> {
    const isUpvoted = type === 'up';
    const { error } = await supabaseClient
        .from('votes')
        .upsert(
            {
                chat_id: chatId,
                message_id: messageId,
                is_upvoted: isUpvoted,
            },
            { onConflict: ['chat_id', 'message_id'] }
        );
    if (error) throw new Error(error.message);
}

export async function getVotesByChatId({
    supabaseClient,
    id,
}: {
    supabaseClient: SupabaseClient;
    id: string;
}): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('votes')
        .select('*')
        .eq('chat_id', id);
    if (error) throw new Error(error.message);
    return data;
}

export async function updateChatVisibilityById({
    supabaseClient,
    chatId,
    visibility,
}: {
    supabaseClient: SupabaseClient;
    chatId: string;
    visibility: 'private' | 'public';
}): Promise<void> {
    const { error } = await supabaseClient
        .from('chats')
        .update({ visibility })
        .eq('id', chatId);
    if (error) throw new Error(error.message);
}