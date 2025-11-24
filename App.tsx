import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { Footer } from './components/Footer';
import { AppState, AnalysisResult, ResumeData } from './types';
import { analyzeResume } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [targetRole, setTargetRole] = useState<string>('');

  const apiKey = process.env.API_KEY;

  const handleStart = () => {
    // Transition to INPUT state to show the form
    setAppState(AppState.INPUT);
  };

  const handleAnalysis = async (data: ResumeData) => {
    // Transition to ANALYZING state to show loader
    setAppState(AppState.ANALYZING);
    setTargetRole(data.targetRole);
    try {
      const analysis = await analyzeResume(data.text, data.targetRole);
      setResult(analysis);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error("Analysis failed", error);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAppState(AppState.INPUT); // Go back to input
    setTargetRole('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-neutral">
      <Navbar />
      
      {/* Banner for Missing Key (Demo Mode) */}
      {!apiKey && (
        <div className="bg-yellow-50 p-2 text-center text-xs text-yellow-800 border-b border-yellow-200">
          ⚠️ <strong>Demo Mode:</strong> API_KEY is missing. Using mock data for demonstration.
        </div>
      )}

      <main className="flex-grow">
        {appState === AppState.IDLE && (
          <HeroSection onStart={handleStart} />
        )}

        {/* Show Input Section during INPUT or ANALYZING phase */}
        {(appState === AppState.INPUT || appState === AppState.ANALYZING) && (
           <InputSection 
             onSubmit={handleAnalysis} 
             isLoading={appState === AppState.ANALYZING} 
           />
        )}
        
        {appState === AppState.RESULTS && result && (
          <ResultsSection result={result} onReset={handleReset} targetRole={targetRole} />
        )}

        {appState === AppState.ERROR && (
          <div className="text-center py-12 px-4">
            <h3 className="text-lg font-medium text-red-600">Something went wrong.</h3>
            <p className="text-gray-500 mb-4">The AI service might be busy or unavailable.</p>
            <button 
              onClick={() => setAppState(AppState.INPUT)} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;