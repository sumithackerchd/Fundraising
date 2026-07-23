"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { campaignService, type Campaign } from "@/src/services/campaign";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (id) {
          const data = await campaignService.getCampaign(Number(id));
          setCampaign(data);
        }
      } catch (error) {
        console.error("Failed to fetch campaign", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!campaign) {
    return <div className="min-h-screen flex items-center justify-center">Campaign not found</div>;
  }

  const progress = (campaign.raised_amount / campaign.goal_amount) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden mb-8 h-96">
            {campaign.image_url ? (
              <img
                src={campaign.image_url}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-['Montserrat'] mb-4">
            {campaign.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-8 text-sm text-gray-500">
            {campaign.category && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {campaign.category}
              </span>
            )}
            <span>Created on {new Date(campaign.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold mb-4 font-['Montserrat']">Story</h2>
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {campaign.story}
            </div>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
                ${campaign.raised_amount.toLocaleString()}
              </div>
              <div className="text-gray-500 mt-1">
                raised of ${campaign.goal_amount.toLocaleString()} goal
              </div>
            </div>
            
            <Progress value={progress > 100 ? 100 : progress} className="h-2 mb-6" />
            
            <div className="flex justify-between text-sm text-gray-500 mb-8">
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {Math.round(progress)}%
                </span>{" "}
                funded
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                </span>{" "}
                days left
              </div>
            </div>
            
            <Button className="w-full mb-4">
              Donate Now
            </Button>
            
            <div className="text-sm text-center text-gray-500">
              All donations are securely processed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
