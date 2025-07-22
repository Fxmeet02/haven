// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI();

export default function Home() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "hey there! what's on your mind today?" }]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessages(prev => [...prev, { role: "user", content: transcript }]);
          handleSend(transcript);
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const handleSend = async (text: string) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-preview",
      messages: [
        { role: "system", content: "You are a friendly, warm AI therapist named Happi. Keep responses short and comforting." },
        ...messages,
        { role: "user", content: text }
      ],
    });

    const reply = completion.choices[0].message.content;
    setMessages(prev => [...prev, { role: "assistant", content: reply ?? "" }]);

    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(reply ?? "");
      utterance.lang = "en-US";
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Happi</h1>
      <p className="mb-4">{messages[messages.length - 1].content}</p>

      <div className="flex gap-4 mb-4">
        <button onClick={startListening} className="bg-yellow-400 p-6 rounded-full shadow-lg hover:bg-yellow-500 transition">
          🎤
        </button>
        <button onClick={stopListening} className="bg-gray-300 p-6 rounded-full shadow-lg hover:bg-gray-400 transition">
          ❌
        </button>
      </div>

      <div className="max-w-md text-left">
        {messages.slice(1).map((msg, idx) => (
          <div key={idx} className={`mb-2 p-2 rounded ${msg.role === "assistant" ? "bg-yellow-100" : "bg-gray-100"}`}>
            <strong>{msg.role === "assistant" ? "Happi:" : "You:"}</strong> {msg.content}
          </div>
        ))}
      </div>
    </main>
  );
}
