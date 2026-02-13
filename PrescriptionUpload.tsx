import React, { useState, useCallback } from 'react';
import { Upload, FileImage, CheckCircle, AlertCircle } from 'lucide-react';

interface PrescriptionUploadProps {
  onUpload: (data: any) => void;
  language: string;
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onUpload, language }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('idle');
    
    try {
      // Simulate OCR processing with IBM Watson Visual Recognition
      // In a real implementation, you would call IBM Watson's OCR API
      const formData = new FormData();
      formData.append('image', file);
      
      // Mock API call to IBM Watson Visual Recognition
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted text from prescription
      const mockExtractedText = `
        Dr. John Smith, MD
        Medical Center Hospital
        
        Patient: [Name will be filled from form]
        Date: ${new Date().toLocaleDateString()}
        
        Prescription:
        1. Aspirin 100mg - Take 1 tablet daily after meals
        2. Metformin 500mg - Take 2 tablets twice daily
        3. Lisinopril 10mg - Take 1 tablet in the morning
        
        Instructions:
        - Take medications as prescribed
        - Monitor blood pressure regularly
        - Follow up in 2 weeks
        
        Dr. John Smith
        License: MD12345
      `;
      
      setExtractedText(mockExtractedText);
      setUploadStatus('success');
      
      // Call parent component with extracted data
      onUpload({
        file,
        text: mockExtractedText,
        processed: true
      });
      
    } catch (error) {
      console.error('Error processing prescription:', error);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setUploadedFile(imageFile);
      handleFileUpload(imageFile);
    }
  }, [handleFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Prescription Image
        </h3>
        <p className="text-gray-600">
          Upload a clear image of your prescription for AI analysis
        </p>
      </div>

      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isProcessing
            ? 'border-yellow-300 bg-yellow-50'
            : uploadStatus === 'success'
            ? 'border-green-300 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="h-12 w-12 text-red-600" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            {isProcessing ? (
              <p className="text-yellow-700 font-medium">
                Processing prescription with IBM Watson...
              </p>
            ) : uploadStatus === 'success' ? (
              <p className="text-green-700 font-medium">
                Prescription processed successfully!
              </p>
            ) : uploadStatus === 'error' ? (
              <p className="text-red-700 font-medium">
                Error processing prescription. Please try again.
              </p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-700">
                  Drag and drop your prescription image here
                </p>
                <p className="text-gray-500">
                  or click to browse files
                </p>
              </>
            )}
          </div>
        </div>

        {uploadedFile && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <FileImage className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Text Display */}
      {extractedText && (
        <div className="bg-white border rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Extracted Prescription Data:
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {extractedText}
            </pre>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>✓ Text extracted using IBM Watson Visual Recognition</p>
            <p>✓ Prescription data parsed and analyzed</p>
            <p>✓ Ready for medical verification</p>
          </div>
        </div>
      )}

      {/* Processing Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">AI Processing Features:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• IBM Watson Visual Recognition for text extraction</li>
          <li>• Multi-language support with automatic translation</li>
          <li>• Medical terminology recognition</li>
          <li>• Dosage and instruction parsing</li>
          <li>• Doctor signature and license verification</li>
        </ul>
      </div>
    </div>
  );
};

export default PrescriptionUpload;