"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignService, campaignSchema, type CampaignData } from "@/src/services/campaign";
import { Button } from "@/components/ui/button";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignData>({
    resolver: zodResolver(campaignSchema as any),
  });

  const onSubmit = async (data: CampaignData) => {
    try {
      setIsLoading(true);
      setError("");
      
      const newCampaign = await campaignService.createCampaign(data);
      // Auto submit for approval
      await campaignService.submitCampaign(newCampaign.id);
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred while creating the campaign");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-['Montserrat'] mb-8">
        Start a new campaign
      </h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Campaign Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                type="text"
                {...register("title")}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm bg-transparent"
                placeholder="Help us build..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="goal_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Goal Amount ($)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="goal_amount"
                type="number"
                step="0.01"
                {...register("goal_amount")}
                className="appearance-none rounded-md relative block w-full pl-7 px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm bg-transparent"
                placeholder="0.00"
              />
            </div>
            {errors.goal_amount && (
              <p className="mt-1 text-sm text-red-600">{errors.goal_amount.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <div className="mt-1">
              <input
                id="end_date"
                type="datetime-local"
                {...register("end_date")}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm bg-transparent"
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <div className="mt-1">
              <select
                id="category"
                {...register("category")}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm bg-transparent"
              >
                <option value="">Select a category</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency</option>
                <option value="Non-profit">Non-profit</option>
                <option value="Business">Business</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="story" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Story
            </label>
            <div className="mt-1">
              <textarea
                id="story"
                rows={6}
                {...register("story")}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm bg-transparent"
                placeholder="Tell your story..."
              />
              {errors.story && (
                <p className="mt-1 text-sm text-red-600">{errors.story.message}</p>
              )}
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create & Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
