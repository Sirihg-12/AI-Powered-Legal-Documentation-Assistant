import React, { useEffect, useRef, useState } from 'react';
import { Mic, Send, Upload, Volume2 } from 'lucide-react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// ✅ Supabase initialization
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ✅ Convert text to speech
const speak = (text: string) => {
  const synth = window.speechSynthesis;
  if (!synth) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  synth.speak(utterance);
};

// ✅ Get legal document from GPT
const getLegalAnswer = async (query: string): Promise<string> => {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a legal expert assistant that helps draft legal documents.' },
          { role: 'user', content: `Create a legal document based on: ${query}` }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('OpenAI Error:', err);
    return 'Sorry, something went wrong with the AI response.';
  }
};

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const anonymousUserId = localStorage.getItem('chat_user_id') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('chat_user_id', anonymousUserId);
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Fetch previous chat
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', anonymousUserId)
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching history:', error.message);
    if (data) {
      const pastMessages = data.flatMap((row) => [
        { sender: 'user' as const, text: row.user_message },
        { sender: 'bot' as const, text: row.bot_response }
      ]);
      setMessages(pastMessages);
    }
  };

  // ✅ Save conversation
  const saveToSupabase = async (userMessage: string, botResponse: string) => {
    await supabase.from('chat_history').insert([
      {
        user_id: anonymousUserId,
        user_message: userMessage,
        bot_response: botResponse
      }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const userMessage = { sender: 'user' as const, text: userText };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const botReply = await getLegalAnswer(userText);
    const botMessage = { sender: 'bot' as const, text: botReply };
    setMessages((prev) => [...prev, botMessage]);
    speak(botReply);

    await saveToSupabase(userText, botReply);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech recognition not supported in this browser.');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const path = `chat-uploads/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('uploads').upload(path, file);

    if (error) {
      console.error('Upload failed:', error.message);
      return;
    }

    const userMessage = { sender: 'user' as const, text: `Uploaded file: ${file.name}` };
    const botMessage = {
      sender: 'bot' as const,
      text: `Thanks for uploading ${file.name}. Our legal assistant will review it.`
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    speak(botMessage.text);

    await saveToSupabase(userMessage.text, botMessage.text);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4 flex items-center justify-center"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/5993554/pexels-photo-5993554.jpeg?auto=compress&cs=tinysrgb&w=1200)' // Replace with legal-themed background if required
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 space-y-4">
        <h2 className="text-center text-2xl font-semibold text-blue-700">
          AI Legal Assistant Chatbot
        </h2>

        <div className="overflow-y-auto max-h-[400px] space-y-2 pr-2">
          {messages.length === 0 && (
            <p className="text-center text-gray-400">No messages yet. Ask away!</p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-blue-100 self-end ml-auto'
                  : 'bg-gray-200 self-start mr-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startListening}
            className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            <Mic />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your legal question..."
            className="flex-1 p-2 border rounded-full"
          />

          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            <Send size={18} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            <Upload size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
          />

          <button
            onClick={() => speak(input || 'Hello! How can I assist you legally?')}
            className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500"
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
