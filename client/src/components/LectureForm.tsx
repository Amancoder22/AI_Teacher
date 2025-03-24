import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface LectureFormProps {
  onGenerateLecture: (topic: string, grade: string) => void;
  isLoading: boolean;
}

const LectureForm: React.FC<LectureFormProps> = ({ onGenerateLecture, isLoading }) => {
  const [topic, setTopic] = React.useState<string>("");
  const [grade, setGrade] = React.useState<string>("3");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateLecture(topic, grade);
  };

  return (
    <Card className="mb-8 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            What would you like to learn about today?
          </label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="For example: Dinosaurs, Solar System, Fractions..."
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            What grade are you in?
          </label>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger id="grade">
              <SelectValue placeholder="Select your grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Grade</SelectItem>
              <SelectItem value="2">2nd Grade</SelectItem>
              <SelectItem value="3">3rd Grade</SelectItem>
              <SelectItem value="4">4th Grade</SelectItem>
              <SelectItem value="5">5th Grade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full py-3"
            disabled={isLoading}
          >
            <i className="fas fa-magic mr-2"></i>
            {isLoading ? "Generating..." : "Generate My Lecture"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LectureForm;
