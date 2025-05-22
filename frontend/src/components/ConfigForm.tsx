"use client";

// No longer needs useState for these, they will come from props
// import { useState } from 'react';
import Spinner from "./Spinner"; // Import Spinner

interface ConfigFormProps {
  theme: string;
  setTheme: (theme: string) => void;
  numTopics: number;
  setNumTopics: (num: number) => void;
  targetAudience: string;
  setTargetAudience: (audience: string) => void;
  onSubmit: () => void; // Function to call when the form is submitted (button clicked)
  isLoading: boolean; // To disable button during loading
}

export default function ConfigForm({
  theme,
  setTheme,
  numTopics,
  setNumTopics,
  targetAudience,
  setTargetAudience,
  onSubmit,
  isLoading,
}: ConfigFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!theme.trim()) {
      // Optionally, add more sophisticated validation feedback here
      alert("Blog theme cannot be empty.");
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="theme"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Blog Theme or Topic Area
        </label>
        <input
          type="text"
          name="theme"
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g., AI in Education"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="numTopics"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Number of Topic Ideas
        </label>
        <input
          type="number"
          name="numTopics"
          id="numTopics"
          value={numTopics}
          onChange={(e) => setNumTopics(parseInt(e.target.value, 10))}
          min="1"
          max="10"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="targetAudience"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Target Audience
        </label>
        <textarea
          name="targetAudience"
          id="targetAudience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          rows={4}
          placeholder="Describe your target audience..."
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!theme.trim() || isLoading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center" // Added flex for spinner
      >
        {isLoading && <Spinner size="w-4 h-4 mr-2" />}
        {isLoading ? 'Generating...' : 'Generate Topic Ideas'}
      </button>
    </form>
  );
}
