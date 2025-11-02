import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-16 max-w-2xl w-full text-center transform transition-all hover:scale-105">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Welcome to Your Learning Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Start your journey to mastering new skills
        </p>
        
        <div className="flex gap-6 justify-center flex-wrap">
          <button
            onClick={() => navigate('/lessons')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/browse')}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold px-10 py-4 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Browse Lessons
          </button>
        </div>
      </div>
    </div>
  );
};