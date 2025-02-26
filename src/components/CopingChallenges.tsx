import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CopingChallenges = () => {
  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Daily Coping Challenges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Today's Progress</span>
              <span>2/3 Completed</span>
            </div>
            <Progress value={66} className="bg-white/20" />
          </div>
          <div className="space-y-3">
            <p className="text-gray-300">
              Complete daily challenges to build healthy coping mechanisms.
            </p>
            <Button 
              variant="outline"
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              View Challenges
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopingChallenges; 