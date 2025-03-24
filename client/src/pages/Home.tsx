import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import LectureForm from "@/components/LectureForm";
import LectureDisplay from "@/components/LectureDisplay";
import SuggestedTopics from "@/components/SuggestedTopics";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lecture } from "@shared/types";

const Home = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lectureData, setLectureData] = React.useState<Lecture | null>(null);
  const { toast } = useToast();

  const generateLectureMutation = useMutation({
    mutationFn: async ({ topic, grade }: { topic: string; grade: string }) => {
      const response = await apiRequest(
        "POST",
        "/api/lectures/generate",
        { topic, grade }
      );
      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data: Lecture) => {
      setLectureData(data);
      setIsLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to generate lecture. Please try again.");
      setIsLoading(false);
      toast({
        title: "Error",
        description: err.message || "Failed to generate lecture. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateLecture = (topic: string, grade: string) => {
    if (!topic.trim()) {
      toast({
        title: "Missing topic",
        description: "Please enter a topic to generate a lecture.",
        variant: "destructive",
      });
      return;
    }
    
    generateLectureMutation.mutate({ topic, grade });
  };

  const handleSuggestedTopic = (topic: string, grade: string) => {
    handleGenerateLecture(topic, grade);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          <IntroSection />
          
          <LectureForm onGenerateLecture={handleGenerateLecture} isLoading={isLoading} />
          
          {(isLoading || error || lectureData) && (
            <LectureDisplay
              isLoading={isLoading}
              error={error}
              lectureData={lectureData}
            />
          )}
          
          {lectureData && (
            <SuggestedTopics 
              currentGrade={lectureData.gradeLevel} 
              onSelectTopic={handleSuggestedTopic} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
