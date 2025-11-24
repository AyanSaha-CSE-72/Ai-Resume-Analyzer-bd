import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:mt-0 md:order-1 w-full">
          <p className="text-center text-base text-gray-400">
            &copy; 2025 AI Resume Analyzer. Built by Ayan Saha.
          </p>
        </div>
      </div>
    </footer>
  );
};