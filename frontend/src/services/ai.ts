import api from '@/lib/axios';

export const aiService = {
  generateStory: async (title: string, description: string, tone: string = 'emotional') => {
    const response = await api.post('/ai/generate-story', { title, description, tone });
    return response.data;
  },
  
  generateSeo: async (title: string, story: string) => {
    const response = await api.post('/ai/generate-seo', { title, story });
    return response.data;
  },
  
  translate: async (text: string, targetLanguage: string) => {
    const response = await api.post('/ai/translate', { text, target_language: targetLanguage });
    return response.data;
  }
};
