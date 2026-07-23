import api from '@/lib/axios';
import { z } from 'zod';

export const donationSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  message: z.string().optional(),
  is_anonymous: z.boolean().default(false),
  campaign_id: z.number(),
});

export type DonationData = z.input<typeof donationSchema>;

export interface Donation {
  id: number;
  amount: number;
  message?: string;
  is_anonymous: boolean;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  campaign_id: number;
  user_id?: number;
  created_at: string;
  donor_name?: string;
}

export const donationService = {
  createDonation: async (data: DonationData) => {
    const response = await api.post('/donations/', data);
    return response.data;
  },
  
  confirmDonation: async (donationId: number): Promise<Donation> => {
    const response = await api.post(`/donations/${donationId}/confirm`);
    return response.data;
  },
  
  getCampaignDonations: async (campaignId: number): Promise<Donation[]> => {
    const response = await api.get(`/donations/campaign/${campaignId}`);
    return response.data;
  },
  
  getMyDonations: async (): Promise<Donation[]> => {
    const response = await api.get('/donations/me');
    return response.data;
  },
};
