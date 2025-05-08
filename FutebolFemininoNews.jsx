
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const matches = [
  {
    id: 1,
    teams: "Brasil vs Argentina",
    date: "07/05/2025",
    time: "18:00",
    venue: "Maracanã, Rio de Janeiro",
    status: "Em andamento",
    score: "1 - 0",
  },
  {
    id: 2,
    teams: "EUA vs Canadá",
    date: "08/05/2025",
    time: "20:00",
    venue: "Rose Bowl, Pasadena",
    status: "Agendada",
    score: null,
  }
];

const ChatIA = () => {
  const [messages, setMessages] = useState([{ sender: 'IA', text: 'Olá! Pergunte algo sobre as partidas.' }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;
    const userMessage = { sender: 'Você', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pergunta: input })
      });
      const data = await res.json();
      const iaResponse = { sender: 'IA', text: data.resposta };
      setMessages(prev => [...prev, iaResponse]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'IA', text: 'Erro ao conectar com o servidor.' }]);
    }

    setInput('');
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl mt-6">
      <h2 className="text-lg font-semibold mb-2 flex items-center"><MessageCircle className="mr-2" /> Chat com IA</h2>
      <div className="h-40 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, index) => (
          <div key={index} className={`text-sm ${msg.sender === 'IA' ? 'text-gray-800' : 'text-blue-600'}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pergunte algo..." />
        <Button onClick={handleSend}>Enviar</Button>
      </div>
    </div>
  );
};

export default function FutebolFemininoNews() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Notícias e Partidas - Futebol Feminino</h1>
      <div className="grid gap-4">
        {matches.map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{match.teams}</h2>
                <p className="text-sm text-gray-500">{match.date} às {match.time}</p>
                <p className="text-sm">Local: {match.venue}</p>
                <p className="text-sm font-medium mt-1">Status: {match.status}</p>
                {match.score && <p className="text-lg font-bold mt-1">Placar: {match.score}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <ChatIA />
    </div>
  );
}
