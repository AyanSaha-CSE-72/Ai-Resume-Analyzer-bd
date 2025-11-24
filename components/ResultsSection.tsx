import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsSectionProps {
  result: AnalysisResult;
  onReset: () => void;
  targetRole: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onReset, targetRole }) => {
  // Helper to color code the score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBadgeColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header / Summary Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-primary px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-bold">Analysis Report</h2>
            <p className="text-green-100 text-sm">Target: {targetRole}</p>
          </div>
          <button onClick={onReset} className="text-xs bg-white text-primary px-3 py-1 rounded hover:bg-gray-100 transition">
            Analyze Another
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className={`${result.overallScore >= 80 ? 'text-green-500' : result.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`} strokeDasharray={`${result.overallScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</span>
                <span className="text-xs text-gray-500 font-medium uppercase">Score</span>
              </div>
            </div>
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {result.overallLabel}
            </span>
          </div>

          {/* Text Summary */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Executive Summary</h3>
            <p className="text-gray-600 mb-4">{result.summary}</p>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Match for {targetRole}</h4>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${result.matchPercentage}%` }}></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">{result.matchPercentage}% Match</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Detailed Scores & Skills */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Section Breakdown</h3>
            <div className="space-y-4">
              {result.sectionScores.map((section) => (
                <div key={section.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{section.name}</span>
                    <span className={`text-sm font-bold ${getScoreColor(section.score)}`}>{section.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${section.score > 75 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${section.score}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">"{section.feedback}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Missing Keywords</h3>
            {result.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-50 text-red-700 border border-red-100">
                    + {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-green-600 text-sm">Great job! No major keywords missing.</p>
            )}
            <p className="text-xs text-gray-400 mt-3">Add these to your Skills or Projects section to improve ATS ranking.</p>
          </div>
        </div>

        {/* Middle Column: Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Plan */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Improvement Actions
            </h3>
            <div className="space-y-4">
              {result.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start bg-gray-50 p-4 rounded-md border-l-4 border-secondary">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor(suggestion.impact)}`}>
                      {suggestion.impact} Impact
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{suggestion.category}</p>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bangla Context - Special Feature */}
          <div className="bg-green-50 shadow rounded-lg p-6 border border-green-100">
            <h3 className="text-lg font-bold text-primary mb-2 flex items-center">
              🇧🇩 For Bangladeshi Students
            </h3>
            <p className="text-sm text-gray-600 mb-4">Specific tips for the local context and freshers.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.banglaContext.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded shadow-sm">
                  <div className="flex items-center mb-2">
                    {item.isOptimized ? (
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    )}
                    <span className="text-sm font-semibold text-gray-800">{item.topic}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.advice}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};