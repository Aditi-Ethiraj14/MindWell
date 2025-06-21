import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PointsCardProps {
  points: number;
}

export default function PointsCard({ points }: PointsCardProps) {
  const { toast } = useToast();
  const [isConversionDialogOpen, setIsConversionDialogOpen] = useState(false);

  const handleConversion = () => {
    // In a real implementation, this would call a blockchain API
    setIsConversionDialogOpen(false);
    toast({
      title: "Coming Soon",
      description: "Token conversion will be available in a future update.",
    });
  };

  return (
    <>
      <Card className="dashboard-card bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium">Your Points</h3>
            <div className="h-8 w-8 flex items-center justify-center bg-secondary-50 text-secondary-500 rounded-full">
              <i className="fas fa-gem"></i>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-semibold text-secondary-600 mb-2">{points}</div>
            <p className="text-neutral-500 text-sm">wellness points</p>
            <Dialog open={isConversionDialogOpen} onOpenChange={setIsConversionDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="mt-4 flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600"
                  size="sm"
                >
                  <i className="fas fa-arrow-right-to-bracket"></i>
                  <span>Convert to Tokens</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Convert Points to Tokens</DialogTitle>
                  <DialogDescription>
                    You currently have {points} wellness points. Would you like to convert them to blockchain tokens?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleConversion}>Convert Points</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
