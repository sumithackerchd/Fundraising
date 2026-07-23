import api from '@/lib/axios';
import { z } from 'zod';

export const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  story: z.string().min(20, 'Story must be at least 20 characters'),
  goal_amount: z.coerce.number().positive('Goal amount must be positive'),
  end_date: z.string(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

export type CampaignData = z.input<typeof campaignSchema>;

export interface Campaign {
  id: number;
  title: string;
  story: string;
  goal_amount: number;
  raised_amount: number;
  end_date: string;
  category?: string;
  tags?: string;
  image_url?: string;
  document_url?: string;
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'completed';
  user_id: number;
  created_at: string;
  updated_at: string;
}

export const campaignService = {
  getCampaigns: async (skip = 0, limit = 100): Promise<Campaign[]> => {
    const response = await api.get(`/campaigns/?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  getCampaign: async (id: number): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },
  
  getMyCampaigns: async (): Promise<Campaign[]> => {
    const response = await api.get('/campaigns/me');
    return response.data;
  },
  
  createCampaign: async (data: CampaignData): Promise<Campaign> => {
    const response = await api.post('/campaigns/', data);
    return response.data;
  },
  
  submitCampaign: async (id: number): Promise<Campaign> => {
    const response = await api.post(`/campaigns/${id}/submit`);
    return response.data;
  },
};
