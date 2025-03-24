import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lecture } from "@shared/types";
import { initTextToSpeech, stopSpeech } from "@/lib/textToSpeech";

interface LectureDisplayProps {
  isLoading: boolean;
  error: string | null;
  lectureData: Lecture | null;
}

const LectureDisplay: React.FC<LectureDisplayProps> = ({ 
  isLoading, 
  error, 
  lectureData
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [starRating, setStarRating] = useState(0);

  // Cleanup text-to-speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else if (lectureData) {
      // Get text content from the lecture without HTML tags
      const lectureContent = lectureData.content;
      initTextToSpeech(lectureContent);
      setIsPlaying(true);
    }
  };

  const handleRating = (rating: number) => {
    setStarRating(rating);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // Create a blob from the lecture content
    if (!lectureData) return;
    
    const fileName = `${lectureData.title.replace(/\s+/g, '_')}.html`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${lectureData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4F46E5; }
          h2 { color: #4F46E5; margin-top: 20px; }
          h3 { color: #10B981; }
          .lecture-content { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>${lectureData.title}</h1>
        <p>${lectureData.subtitle}</p>
        <div class="lecture-content">
          ${lectureData.content}
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-10 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">Please wait while our AI teacher prepares your lecture...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="p-10 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-error-500 text-3xl">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Oops! Something went wrong</h3>
            <p className="text-gray-600">{error}</p>
            <Button variant="default" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!lectureData) {
    return null;
  }

  return (
    <Card className="overflow-hidden mb-8">
      {/* Lecture Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
        <div className="flex items-start">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{lectureData.title}</h2>
            <p className="opacity-90">{lectureData.subtitle}</p>
          </div>
          <div>
            <Button 
              variant="white" 
              size="icon" 
              className="p-3 rounded-full"
              onClick={handlePlayPause}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Audio Controls (visible when playing) */}
      {isPlaying && (
        <div className="bg-gray-100 px-6 py-3 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="white" 
              size="icon"
              className="p-2 rounded-full mr-3"
              onClick={handlePlayPause}
            >
              <i className="fas fa-pause"></i>
            </Button>
            <span className="text-sm text-gray-600">Currently playing...</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="white" 
              size="icon"
              className="p-2 rounded-full"
              onClick={stopSpeech}
            >
              <i className="fas fa-stop"></i>
            </Button>
          </div>
        </div>
      )}
      
      {/* Lecture Content */}
      <div className="p-6 lecture-content">
        <div 
          className="lecture-content" 
          dangerouslySetInnerHTML={{ __html: lectureData.content }}
        />
      </div>
      
      {/* Lecture Footer */}
      <div className="bg-gray-50 p-6 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-medium text-gray-800">How was this lecture?</h3>
            <div className="flex items-center mt-2 space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button 
                  key={rating}
                  className="p-2 text-xl hover:text-yellow-500 transition"
                  onClick={() => handleRating(rating)}
                >
                  <i className={`fas fa-star ${starRating >= rating ? 'text-yellow-500' : 'text-gray-400'}`}></i>
                </button>
              ))}
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="white" onClick={handlePrint}>
              <i className="fas fa-print mr-2"></i>
              Print
            </Button>
            <Button variant="default" onClick={handleSave}>
              <i className="fas fa-save mr-2"></i>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LectureDisplay;
