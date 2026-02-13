import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';

interface VoiceInputProps {
  onVoiceInput: (transcript: string) => void;
  language: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, language }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = getLanguageCode(language);
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          onVoiceInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onVoiceInput]);

  const getLanguageCode = (lang: string) => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ar': 'ar-SA',
      'hi': 'hi-IN'
    };
    return langMap[lang] || 'en-US';
  };

  const startRecording = () => {
    if (recognitionRef.current && isSupported) {
      setTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-8">
        <MicOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Voice Input Not Supported
        </h3>
        <p className="text-gray-500">
          Your browser doesn't support speech recognition. Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Voice Medicine Input
        </h3>
        <p className="text-gray-600">
          Speak your current medicines and we'll process them using AI
        </p>
      </div>

      {/* Recording Interface */}
      <div className="flex flex-col items-center space-y-6">
        <div className={`relative p-8 rounded-full ${
          isRecording 
            ? 'bg-red-100 animate-pulse border-4 border-red-300' 
            : 'bg-blue-100 border-4 border-blue-300'
        } transition-all`}>
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="p-6 bg-red-600 rounded-full text-white hover:bg-red-700 transition-all"
            >
              <Square size={32} />
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="p-6 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all"
            >
              <Mic size={32} />
            </button>
          )}
        </div>

        <div className="text-center">
          {isRecording ? (
            <div>
              <p className="text-red-600 font-semibold text-lg mb-2">
                🔴 Recording... Speak your medicines
              </p>
              <p className="text-gray-500 text-sm">
                Click the square to stop recording
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 font-semibold text-lg mb-2">
                Click the microphone to start recording
              </p>
              <p className="text-gray-500 text-sm">
                Speak clearly and mention each medicine name
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-white border rounded-xl p-6">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-lg font-semibold text-gray-800">
              Voice Transcript:
            </h4>
            <button
              onClick={() => speakText(transcript)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Read aloud"
            >
              <Volume2 size={20} />
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">
              {transcript || 'Start speaking to see transcript...'}
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>✓ Real-time speech-to-text conversion</p>
            <p>✓ Multi-language support ({language.toUpperCase()})</p>
            <p>✓ Medical terminology recognition</p>
          </div>
        </div>
      )}

      {/* Voice Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h4 className="font-semibold text-green-800 mb-2">Voice Input Tips:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Mention each medicine name separately</li>
          <li>• Include dosage information if known</li>
          <li>• You can pause and continue recording</li>
          <li>• The system supports multiple languages</li>
        </ul>
      </div>

      {/* Language-specific examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Example Phrases:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          {language === 'en' && (
            <>
              <p>• "I am taking Aspirin 100 milligrams once daily"</p>
              <p>• "Metformin 500mg twice a day with meals"</p>
              <p>• "Lisinopril 10 milligrams in the morning"</p>
            </>
          )}
          {language === 'es' && (
            <>
              <p>• "Estoy tomando Aspirina 100 miligramos una vez al día"</p>
              <p>• "Metformina 500mg dos veces al día con las comidas"</p>
              <p>• "Lisinopril 10 miligramos por la mañana"</p>
            </>
          )}
          {language === 'fr' && (
            <>
              <p>• "Je prends de l'Aspirine 100 milligrammes une fois par jour"</p>
              <p>• "Metformine 500mg deux fois par jour avec les repas"</p>
              <p>• "Lisinopril 10 milligrammes le matin"</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;