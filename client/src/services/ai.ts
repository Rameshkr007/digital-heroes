import api from './api';

export interface AIMentorResponse {
  reply: string;
  timestamp: string;
}

export const aiService = {
  async askMentor(message: string) {
    const res = await api.post('/ai/mentor', { message });
    return res.data.data as AIMentorResponse;
  },
};
