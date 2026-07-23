"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { campaignService, type Campaign } from "@/src/services/campaign";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-['Montserrat']">
          Active Campaigns
        </h1>
        <Link
          href="/dashboard/campaigns/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Create Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => {
          const progress = (campaign.raised_amount / campaign.goal_amount) * 100;
          return (
            <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                  {campaign.image_url ? (
                    <img
                      src={campaign.image_url}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {campaign.story}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-black dark:text-white">
                        ${campaign.raised_amount.toLocaleString()} raised
                      </span>
                      <span className="text-gray-500">
                        of ${campaign.goal_amount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progress > 100 ? 100 : progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {campaigns.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No active campaigns found. Be the first to create one!
        </div>
      )}
    </div>
  );
}
