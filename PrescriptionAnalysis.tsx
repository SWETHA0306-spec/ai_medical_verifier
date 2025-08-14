import React, { useState } from 'react';
import { User, Phone, Calendar, Weight, Ruler, FileText, Mic, Upload, MessageCircle } from 'lucide-react';
import PrescriptionUpload from './PrescriptionUpload';
import VoiceInput from './VoiceInput';
import ChatBox from './ChatBox';
import LanguageSelector from './LanguageSelector';

interface UserData {
  name: string;
  phone: string;
  age: string;
  weight: string;
  height: string;
  previousPrescriptions: string;
  geneticDiseases: string;
  medicines: string[];
}

interface LoginPageProps {
  onLogin: (userData: UserData) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    previousPrescriptions: '',
    geneticDiseases: '',
    medicines: []
  });
  
  const [inputMode, setInputMode] = useState<'form' | 'upload' | 'voice' | 'chat'>('form');
  const [language, setLanguage] = useState('en');

  const handleInputChange = (field: keyof UserData, value: string | string[]) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userData);
  };

  const handleFileUpload = (prescriptionData: any) => {
    // Process uploaded prescription image
    setUserData(prev => ({
      ...prev,
      previousPrescriptions: prescriptionData.text || 'Prescription uploaded and processed'
    }));
  };

  const handleVoiceInput = (transcript: string) => {
    // Process voice input for medicines
    const medicines = transcript.split(',').map(med => med.trim());
    setUserData(prev => ({
      ...prev,
      medicines: [...prev.medicines, ...medicines]
    }));
  };

  const handleChatMessage = (message: string) => {
    // Process chat input for additional information
    setUserData(prev => ({
      ...prev,
      previousPrescriptions: prev.previousPrescriptions + '\n' + message
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              AI Medical Prescription Verification
            </h1>
            <p className="text-center text-blue-100 mb-6">
              Powered by IBM Watson & Hugging Face Models
            </p>
            <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />
          </div>

          {/* Input Mode Selector */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setInputMode('form')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  inputMode === 'form'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User size={20} />
                Manual Entry
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  inputMode === 'upload'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Upload size={20} />
                Upload Prescription
              </button>
              <button
                onClick={() => setInputMode('voice')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  inputMode === 'voice'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Mic size={20} />
                Voice Input
              </button>
              <button
                onClick={() => setInputMode('chat')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  inputMode === 'chat'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MessageCircle size={20} />
                Chat Interface
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {inputMode === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline mr-2" size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline mr-2" size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline mr-2" size={16} />
                      Age
                    </label>
                    <input
                      type="number"
                      value={userData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter age"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Weight className="inline mr-2" size={16} />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={userData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter weight"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Ruler className="inline mr-2" size={16} />
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={userData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter height"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline mr-2" size={16} />
                    Previous Prescription Records
                  </label>
                  <textarea
                    value={userData.previousPrescriptions}
                    onChange={(e) => handleInputChange('previousPrescriptions', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter previous prescription details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genetic Diseases & Conditions
                  </label>
                  <textarea
                    value={userData.geneticDiseases}
                    onChange={(e) => handleInputChange('geneticDiseases', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List any genetic diseases or hereditary conditions..."
                  />
                </div>

                {userData.medicines.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medicines (Added via Voice/Chat)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {userData.medicines.map((medicine, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {medicine}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Verify Prescription
                </button>
              </form>
            )}

            {inputMode === 'upload' && (
              <PrescriptionUpload onUpload={handleFileUpload} language={language} />
            )}

            {inputMode === 'voice' && (
              <VoiceInput onVoiceInput={handleVoiceInput} language={language} />
            )}

            {inputMode === 'chat' && (
              <ChatBox onMessage={handleChatMessage} language={language} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;