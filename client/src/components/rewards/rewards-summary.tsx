import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

type RewardsSummaryProps = {
  points: number;
  achievements: { name: string; description: string; icon: string }[];
  nextMilestone: number;
};

export default function RewardsSummary({ 
  points, 
  achievements, 
  nextMilestone 
}: RewardsSummaryProps) {
  // Calculate progress to next milestone
  const progress = Math.min(100, (points / nextMilestone) * 100);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Points</CardTitle>
          <CardDescription>
            Earn points by completing activities and maintaining your streak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">{points}</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next milestone ({nextMilestone} points)</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Your Achievements
          </CardTitle>
          <CardDescription>
            Complete activities to unlock achievements and earn bonus points
          </CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <i className={`fas ${achievement.icon} text-xl`}></i>
                  </div>
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Complete activities to earn your first achievement!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}