import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestedTopicsProps {
  currentGrade: string;
  onSelectTopic: (topic: string, grade: string) => void;
}

const SuggestedTopics: React.FC<SuggestedTopicsProps> = ({ currentGrade, onSelectTopic }) => {
  // Predefined topics based on grade levels
  const gradeTopics: Record<string, string[]> = {
    "1": ["Animals", "Weather", "The Five Senses", "Plants", "My Body", "Family"],
    "2": ["Habitats", "Life Cycles", "Matter", "Earth & Space", "Community Helpers", "Money"],
    "3": ["The Water Cycle", "Animal Habitats", "Weather Patterns", "Simple Machines", "Nutrition", "Maps"],
    "4": ["Ecosystems", "Electricity", "Solar System", "Earth's Layers", "Fractions", "U.S. Regions"],
    "5": ["Human Body Systems", "Forces & Motion", "Weather & Climate", "Matter & Energy", "Native Americans", "The Constitution"]
  };

  // Get suggested topics for the current grade
  const topics = gradeTopics[currentGrade] || gradeTopics["3"];
  
  // Select 3 random topics
  const getRandomTopics = (topicList: string[], count: number): string[] => {
    const shuffled = [...topicList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const suggestedTopics = getRandomTopics(topics, 3);

  return (
    <section className="mt-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Try these topics next:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedTopics.map((topic, index) => (
          <button 
            key={index}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
            onClick={() => onSelectTopic(topic, currentGrade)}
          >
            <div className="font-medium text-primary-500">{topic}</div>
            <div className="text-sm text-gray-600">
              {currentGrade === "1" ? "1st" : 
               currentGrade === "2" ? "2nd" :
               currentGrade === "3" ? "3rd" : `${currentGrade}th`} Grade
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SuggestedTopics;
