import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBoxProps {
  onMessage: (message: string) => void;
  language: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onMessage, language }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getWelcomeMessage(language),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  function getWelcomeMessage(lang: string): string {
    const messages: { [key: string]: string } = {
      'en': 'Hello! I\'m your AI medical assistant. Please tell me about your current medications, symptoms, or any medical concerns you have.',
      'es': 'Hola! Soy tu asistente médico de IA. Por favor, dime sobre tus medicamentos actuales, síntomas o cualquier preocupación médica que tengas.',
      'fr': 'Bonjour! Je suis votre assistant médical IA. Veuillez me parler de vos médicaments actuels, symptômes ou préoccupations médicales.',
      'de': 'Hallo! Ich bin Ihr KI-Medizinassistent. Bitte erzählen Sie mir von Ihren aktuellen Medikamenten, Symptomen oder medizinischen Bedenken.',
      'pt': 'Olá! Sou seu assistente médico de IA. Por favor, me fale sobre seus medicamentos atuais, sintomas ou preocupações médicas.',
      'ru': 'Привет! Я ваш медицинский ИИ-помощник. Расскажите мне о ваших текущих лекарствах, симптомах или медицинских проблемах.',
      'zh': '你好！我是您的AI医疗助手。请告诉我您当前的药物、症状或任何医疗问题。',
      'ja': 'こんにちは！私はあなたのAI医療アシスタントです。現在の薬、症状、または医療上の懸念についてお聞かせください。',
      'ar': 'مرحباً! أنا مساعدك الطبي بالذكاء الاصطناعي. يرجى إخباري عن أدويتك الحالية أو الأعراض أو أي مخاوف طبية لديك.'
    };
    return messages[lang] || messages['en'];
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onMessage(inputText);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText, language);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, lang: string): string => {
    // Mock AI response - in real implementation, this would call IBM Watson or Hugging Face
    const responses: { [key: string]: string[] } = {
      'en': [
        'I understand you mentioned medications. Can you provide more details about the dosage and frequency?',
        'That\'s important information. Are you experiencing any side effects with these medications?',
        'I\'ve noted your medical history. Do you have any allergies to medications?',
        'Thank you for sharing. I\'ll analyze this information for potential drug interactions.',
        'Based on your input, I recommend discussing this with your healthcare provider.'
      ],
      'es': [
        'Entiendo que mencionaste medicamentos. ¿Puedes proporcionar más detalles sobre la dosis y frecuencia?',
        'Esa es información importante. ¿Estás experimentando algún efecto secundario con estos medicamentos?',
        'He anotado tu historial médico. ¿Tienes alguna alergia a medicamentos?',
        'Gracias por compartir. Analizaré esta información para posibles interacciones medicamentosas.',
        'Basado en tu información, recomiendo discutir esto con tu proveedor de salud.'
      ]
    };

    const langResponses = responses[lang] || responses['en'];
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white border rounded-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="font-semibold">AI Medical Assistant</h3>
              <p className="text-sm text-blue-100">
                Powered by IBM Watson & Hugging Face
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={`p-2 rounded-full transition-all ${
              isVoiceMode ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {isVoiceMode ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
              <div className="p-2 bg-gray-200 text-gray-600 rounded-full">
                <Bot size={16} />
              </div>
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your medical questions or concerns..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        
        {isVoiceMode && (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">
              🎤 Voice mode active - Click microphone button to record
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;