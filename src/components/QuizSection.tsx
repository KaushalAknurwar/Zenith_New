import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuizSection = () => {
  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Mental Health Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-300">
            Test your knowledge about mental health and well-being through interactive quizzes.
          </p>
          <Button 
            variant="outline"
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Start Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizSection; 