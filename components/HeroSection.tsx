import React from 'react';

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Upgrade your CV for</span>
            <span className="block text-primary">Jobs & Higher Studies</span>
          </h1>
          <p className="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Tailored for Bangladeshi students. Get instant, AI-powered feedback on your resume. 
            Highlight your academic projects, fix formatting, and beat the ATS.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={onStart}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-700 md:py-4 md:text-lg transition-colors"
              >
                Analyze My Resume
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-6 text-sm text-gray-400">
            <span>🇧🇩 For BD Students</span>
            <span>•</span>
            <span>✨ AI Powered</span>
            <span>•</span>
            <span>🔒 Private & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};