import { createClient } from '@supabase/supabase-js';

// ✅ Supabase environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('supabaseUrl or supabaseAnonKey is missing');
}

// ✅ Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Get current user's profile
export const getUserProfile = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  if (error) throw error;
  return data;
};

// ✅ Update user profile
export const updateUserProfile = async (profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', profileData.id);

  if (error) throw error;
  return data;
};

// ✅ Change password
export const changePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
};

// ✅ Save individual chatbot message (for detailed tracking if needed)
export const saveChatMessage = async (
  userId: string,
  role: 'user' | 'bot',
  content: string
) => {
  const { data, error } = await supabase.from('chat_messages').insert([
    {
      user_id: userId,
      role,
      content,
    },
  ]);

  if (error) throw error;
  return data;
};

// ✅ Get chatbot conversation history (detailed)
export const getChatHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

// ✅ Save a pair of chatbot messages (user question + bot answer)
export const saveConversation = async (
  userId: string,
  userMessage: string,
  botResponse: string
) => {
  const { data, error } = await supabase.from('chat_history').insert([
    {
      user_id: userId,
      user_message: userMessage,
      bot_response: botResponse,
    },
  ]);

  if (error) throw error;
  return data;
};

// Note: The `chat_history` table should be created in your Supabase database.
// You can create it using the Supabase SQL editor or a migration script.


// ✅ Fetch conversation (user and bot messages) for UI display
export const getConversationHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

// ✅ Upload file to Supabase Storage bucket "uploads"
export const uploadFile = async (file: File) => {
  const filePath = `chat-uploads/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (error) throw error;
  return data;
};

// ✅ Get public URL of uploaded file
export const getFileUrl = (path: string) => {
  const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);
  return publicUrl;
};
