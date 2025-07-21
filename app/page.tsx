'use client';
import { useState } from "react";

const moods = ["😊 Happy", "😔 Sad", "😡 Angry", "😌 Calm", "😟 Anxious"];
const prompts = [
  "What's on your mind today?",
  "How would you like to feel by the end of this chat?",
  "Is there something specific you want to unpack?"
];

export default function HappiChat() {
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setStep(1);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, `You: ${input}`]);
    // simple reflection for now, later replace with OpenAI or your backend
    setMessages((prev) => [...prev, `Happi: I hear you, let's unpack that together.`]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6">
        {step === 0 && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Hi friend 🌱</h1>
            <p className="text-center mb-4">How are you feeling right now?</p>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className="bg-blue-100 hover:bg-blue-200 rounded-xl p-3 text-center"
                >
                  {mood}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Great, you selected: {selectedMood}</h2>
            <p className="mb-4">{prompts[Math.floor(Math.random() * prompts.length)]}</p>
            <div className="border rounded-lg p-3 h-64 overflow-y-auto flex flex-col gap-2 mb-4 bg-gray-50">
              {messages.length === 0 && (
                <p className="text-gray-400 text-center">Your conversation will appear here.</p>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg ${msg.startsWith("You") ? "bg-blue-100 self-end" : "bg-green-100 self-start"}`}
                >
                  {msg}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your thoughts..."
                className="flex-1 border rounded-lg p-2"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
