"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  let recognition: SpeechRecognition | null = null;

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");
        setTextInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
      };

      recognition.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  const sendMessage = () => {
    if (textInput.trim() === "") return;
    setMessages(prev => [...prev, textInput]);
    setTextInput("");
  };

  const resetMessages = () => {
    setMessages([]);
    setTextInput("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-3xl font-bold mb-2">👋 Welcome to Happi</h1>
      <p className="text-center max-w-lg mb-4">
        hi friend 🌱<br />
        we made happi because life can be... a lot. some days you’re thriving. other days? not so much.
        whether you're spiraling, healing, or just need to get something off your chest —
        we’re here. no pressure. no judgment. just a space to breathe, reflect, and feel a little more okay.
        <br />
        with love, Meet
      </p>
      <div className="flex gap-2 mb-4">
        <button
          onClick={startListening}
          disabled={listening}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-green-300"
        >
          Start Voice
        </button>
        <button
          onClick={stopListening}
          disabled={!listening}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-red-300"
        >
          Stop Voice
        </button>
        <button
          onClick={resetMessages}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder="Type or use voice..."
          className="border px-4 py-2 rounded w-64"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Messages:</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {messages.map((msg, idx) => (
              <li key={idx} className="text-gray-700">{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
