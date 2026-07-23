"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationService, donationSchema, type DonationData } from "@/src/services/donation";
import { Button } from "@/components/ui/button";

export default function DonatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DonationData>({
    resolver: zodResolver(donationSchema as any),
    defaultValues: {
      campaign_id: Number(id),
      is_anonymous: false,
    }
  });

  const onSubmit = async (data: DonationData) => {
    try {
      setIsLoading(true);
      setError("");
      
      const paymentIntent = await donationService.createDonation(data);
      // Mock payment process simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await donationService.confirmDonation(paymentIntent.donation_id);
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/campaigns/${id}`);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat'] mb-2">Thank you for your donation!</h2>
          <p className="text-gray-500">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-['Montserrat'] mb-8 text-center">
        Make a Donation
      </h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[10, 25, 50, 100, 250, 500].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setValue("amount", amount)}
                  className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  ${amount}
                </button>
              ))}
            </div>
            
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register("amount")}
                className="appearance-none rounded-md relative block w-full pl-7 px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-black sm:text-sm bg-transparent"
                placeholder="Custom Amount"
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message (Optional)
            </label>
            <textarea
              {...register("message")}
              rows={3}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-black sm:text-sm bg-transparent"
              placeholder="Leave a message of support..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_anonymous"
              {...register("is_anonymous")}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Make my donation anonymous
            </label>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Complete Donation"}
          </Button>
        </form>
      </div>
    </div>
  );
}
