import React, { useState } from 'react';
import { ResumeData } from '../types';

interface InputSectionProps {
  onSubmit: (data: ResumeData) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [role, setRole] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setText(event.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        setText(`[Loaded file: ${file.name}]\n\n(Note: Automatic PDF parsing is disabled in this demo. Please copy-paste your resume content here for best results.)`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && role.trim()) {
      onSubmit({ text, targetRole: role });
    }
  };

  // Basic formatter for the live preview
  const renderPreview = (rawText: string) => {
    if (!rawText) return <p className="text-gray-400 italic text-center mt-10">Resume preview will appear here...</p>;
    
    return rawText.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4"></div>;
      
      // Heuristic: ALL CAPS or Ends with colon -> Heading
      if ((trimmed === trimmed.toUpperCase() && trimmed.length > 4 && /^[A-Z\s]+$/.test(trimmed)) || trimmed.endsWith(':')) {
        return <h4 key={idx} className="font-bold text-gray-800 mt-4 mb-2 border-b border-gray-200 uppercase text-sm tracking-wide">{trimmed}</h4>;
      }
      // Heuristic: Starts with bullet or dash
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return <li key={idx} className="ml-4 text-sm text-gray-700 list-disc">{trimmed.replace(/^[•\-*]\s*/, '')}</li>;
      }
      return <p key={idx} className="text-sm text-gray-700 mb-1">{trimmed}</p>;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        
        {/* Left Column: Input Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-8 lg:mb-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Role Input */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Target Role / Opportunity <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="role"
                  required
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 border rounded-md p-3 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="e.g. Junior Web Developer, Bank Probationary Officer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Helping the AI understand your goal.</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload or Paste Content <span className="text-red-500">*</span>
              </label>
              
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 mb-4">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary px-2">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.docx" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">TXT, PDF (Text) up to 2MB</p>
                  {fileName && <p className="text-sm text-primary font-semibold mt-2">Selected: {fileName}</p>}
                </div>
              </div>

              <textarea
                rows={12}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md p-3 text-gray-900 bg-white placeholder-gray-500 font-mono text-xs"
                placeholder="Paste your resume content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze Resume'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div className="relative">
           <div className="bg-gray-100 rounded-lg p-1 h-full max-h-[800px] overflow-hidden flex flex-col">
             <div className="bg-gray-200 px-4 py-2 rounded-t-lg flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
             </div>
             <div className="bg-white flex-1 overflow-y-auto p-8 shadow-inner font-serif">
                {renderPreview(text)}
             </div>
           </div>
           
           {/* Decorative elements behind preview */}
           <div className="absolute -z-10 top-4 -right-4 w-full h-full bg-primary opacity-5 rounded-lg transform rotate-2"></div>
        </div>

      </div>
    </div>
  );
};