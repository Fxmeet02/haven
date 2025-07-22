"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

      if ("webkitSpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim();
          setTextInput((prev) => prev + " " + transcript);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSpeak = () => {
    if (synthRef.current && textInput) {
      const utterance = new SpeechSynthesisUtterance(textInput);
      synthRef.current.speak(utterance);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white text-black">
      <h1 className="text-4xl font-bold mb-4">Happi 🌱</h1>
      <p className="mb-6 text-center max-w-md">
        We made Happi because life can be... a lot.
        <br /> Some days you’re thriving. Other days? Not so much.
        <br /> Whether you're spiraling, healing, or just need to get something off your chest — we’re here.
      </p>

      <textarea
        className="border rounded p-4 w-full max-w-md h-40"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Speak or type here..."
      />

      <div className="flex space-x-4 mt-4">
        <button
          onClick={startListening}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start Listening
        </button>
        <button
          onClick={stopListening}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Stop Listening
        </button>
        <button
          onClick={handleSpeak}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Speak
        </button>
      </div>
    </main>
  );
}
