"use client";

import React, { useState, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "hey there 🌱 what's on your mind today?" },
  ]);
  const [input, setInput] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);

  const handleSend = async (messageContent: string) => {
    const newMessages = [...messages, { role: "user", content: messageContent }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    if (data.message) {
      setMessages((prev) => [...prev, { role: "assistant", content: data.message.content }]);

      const utterance = new SpeechSynthesisUtterance(data.message.content);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white text-center">
      <div className="text-xl font-medium mb-4">🧘‍♀️ Happi</div>
      <div className="w-full max-w-md space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-6 space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Type your thoughts..."
          className="border rounded px-4 py-2 w-64"
        />
        <button onClick={() => handleSend(input)} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-4 py-2 rounded ${listening ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
        >
          {listening ? "Stop" : "🎤"}
        </button>
      </div>
    </main>
  );
}
