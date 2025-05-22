"use client";

import { useState } from 'react';
import ConfigForm from '@/components/ConfigForm';
import OutlineDisplay from '@/components/OutlineDisplay';
import Spinner from '@/components/Spinner'; // Import Spinner
import { fetchTopicSuggestions, fetchBlogOutline, BlogOutlineData } from '@/services/api'; 

export default function Home() {
  // State for ConfigForm inputs
  const [theme, setTheme] = useState<string>('');
  const [numTopics, setNumTopics] = useState<number>(3);
  const [targetAudience, setTargetAudience] = useState<string>('General Audience'); // Default or from config

  // State for topic generation results
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);
  const [topicError, setTopicError] = useState<string | null>(null);

  // State for selected topic
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // State for outline generation
  const [generatedOutline, setGeneratedOutline] = useState<BlogOutlineData | null>(null);
  const [isLoadingOutline, setIsLoadingOutline] = useState<boolean>(false);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  // Handler for topic generation
  const handleGenerateTopics = async () => {
    if (!theme.trim()) {
      setTopicError("Please enter a blog theme.");
      // Clear outline state when generating new topics if theme was previously invalid
      setGeneratedOutline(null);
      setOutlineError(null);
      return;
    }
    setIsLoadingTopics(true);
    setTopicError(null);
    setGeneratedTopics([]); // Clear previous topics
    setSelectedTopic(null); // Clear previously selected topic
    setGeneratedOutline(null); // Clear previous outline
    setOutlineError(null); // Clear previous outline error

    try {
      const topics = await fetchTopicSuggestions(theme, numTopics);
      setGeneratedTopics(topics);
    } catch (error) {
      if (error instanceof Error) {
        setTopicError(error.message);
      } else {
        setTopicError('An unknown error occurred.');
      }
    } finally {
      setIsLoadingTopics(false);
    }
  };

  // Handler for outline generation
  const handleGenerateOutline = async () => {
    if (!selectedTopic) {
      setOutlineError("Please select a topic first.");
      return;
    }
    setIsLoadingOutline(true);
    setOutlineError(null);
    setGeneratedOutline(null); // Clear previous outline

    try {
      const outline = await fetchBlogOutline(selectedTopic, targetAudience);
      setGeneratedOutline(outline);
    } catch (error) {
      if (error instanceof Error) {
        setOutlineError(error.message);
      } else {
        setOutlineError('An unknown error occurred.');
      }
    } finally {
      setIsLoadingOutline(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 selection:bg-indigo-500 selection:text-white"> {/* Added selection styles */}
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-200 dark:bg-gray-800 p-6 shadow-xl md:shadow-lg print:hidden"> {/* Added print:hidden, increased shadow */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 sticky top-6">
          Configuration
        </h2>
        <ConfigForm
          theme={theme}
          setTheme={setTheme}
          numTopics={numTopics}
          setNumTopics={setNumTopics}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          onSubmit={handleGenerateTopics}
          isLoading={isLoadingTopics}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10"> {/* Adjusted padding for smaller screens */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center md:text-left"> {/* Centered on small screens */}
          Agentic Blog Planner
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"> {/* Adjusted gap for smaller screens */}
          {/* Topic Ideas Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl"> {/* Changed dark bg, increased shadow */}
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Topic Ideas
            </h3>
            {isLoadingTopics && (
              <div className="flex items-center justify-center py-4">
                <Spinner />
                <span className="ml-2 text-indigo-600 dark:text-indigo-400">Generating topics...</span>
              </div>
            )}
            {topicError && (
              <p className="text-red-600 dark:text-red-400">Error: {topicError}</p>
            )}
            {!isLoadingTopics && !topicError && generatedTopics.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">
                Enter a theme and click 'Generate Topic Ideas' to get started.
              </p>
            )}
            {generatedTopics.length > 0 && (
              <ul className="space-y-2">
                {generatedTopics.map((topic, index) => (
                  <li key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-800 dark:text-gray-200 flex-1">{topic}</span>
                    <button
                      onClick={() => {
                        setSelectedTopic(topic);
                        setGeneratedOutline(null); // Clear outline when new topic is selected
                        setOutlineError(null); // Clear outline error
                      }}
                      className={`px-3 py-1 text-sm rounded-md ml-2
                        ${selectedTopic === topic 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-indigo-500 text-white hover:bg-indigo-600'}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        dark:focus:ring-offset-gray-800`}
                    >
                      {selectedTopic === topic ? 'Selected' : 'Select'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Blog Outline Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl"> {/* Changed dark bg, increased shadow */}
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Blog Outline
            </h3>
            {selectedTopic && (
              <button
                onClick={handleGenerateOutline}
                disabled={isLoadingOutline || !selectedTopic}
                className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center" // Added flex for spinner
              >
                {isLoadingOutline && <Spinner size="w-4 h-4 mr-2" />} {/* Spinner for button */}
                {isLoadingOutline ? 'Generating...' : 'Generate Outline'}
              </button>
            )}
            {isLoadingOutline && !selectedTopic && ( // General loading if button not yet visible
              <div className="flex items-center justify-center py-4">
                <Spinner />
                <span className="ml-2 text-purple-600 dark:text-purple-400">Generating outline...</span>
              </div>
            )}
            {outlineError && (
              <p className="text-red-600 dark:text-red-400">Error: {outlineError}</p>
            )}
            {!selectedTopic && !generatedOutline && (
               <p className="text-gray-600 dark:text-gray-400">
                Select a topic from the left to generate an outline.
              </p>
            )}
            {selectedTopic && !generatedOutline && !isLoadingOutline && !outlineError && (
              <p className="text-gray-600 dark:text-gray-400">
                Click "Generate Outline" to create the blog structure for: <strong className="text-indigo-600 dark:text-indigo-400">{selectedTopic}</strong>.
              </p>
            )}
            {/* Conditional rendering for outline display */}
            {generatedOutline && !isLoadingOutline && !outlineError && (
              <OutlineDisplay outline={generatedOutline} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
