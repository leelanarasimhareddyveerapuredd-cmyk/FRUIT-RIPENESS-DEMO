
import React, { useState, useCallback } from 'react';
import { analyzeFruitImage } from './services/geminiService';
import type { AnalysisResult } from './types';
import ImageUploader from './components/ImageUploader';
import AnalysisResultDisplay from './components/AnalysisResultDisplay';
import Spinner from './components/Spinner';
import { AppleIcon, GrapeIcon, LemonIcon } from './components/icons/FruitIcons';

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile || !imagePreview) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Extract base64 data and mimeType from preview string
      const [header, base64Data] = imagePreview.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1];

      if (!base64Data || !mimeType) {
        throw new Error('Invalid image format.');
      }

      const result = await analyzeFruitImage(base64Data, mimeType);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Analysis failed. ${errorMessage}. Please ensure your API key is configured correctly and try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imagePreview]);
  
  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-100 font-sans text-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
           <div className="flex justify-center items-center gap-4 mb-4">
                <AppleIcon className="w-12 h-12 text-red-400" />
                <GrapeIcon className="w-16 h-16 text-purple-500" />
                <LemonIcon className="w-12 h-12 text-yellow-300" />
            </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Fruit Ripeness Inspector
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image of a fruit and let AI determine its ripeness and quality in seconds.
          </p>
        </header>

        <main className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
          {!imagePreview && (
            <ImageUploader onImageUpload={handleImageChange} />
          )}

          {imagePreview && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md rounded-lg overflow-hidden shadow-md mb-6 border-4 border-white">
                <img src={imagePreview} alt="Selected fruit" className="w-full h-auto object-cover" />
              </div>
              
              <div className="w-full flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading}
                  className="w-full flex-grow bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                >
                  {isLoading ? <Spinner /> : 'Analyze Ripeness'}
                </button>
                <button
                  onClick={resetState}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
              <strong>Oops!</strong> {error}
            </div>
          )}
          
          {analysisResult && (
            <div className="mt-8">
              <AnalysisResultDisplay result={analysisResult} />
            </div>
          )}
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
}
