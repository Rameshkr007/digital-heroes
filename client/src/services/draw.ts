import api from './api';

export interface DrawPoolItem {
  id: string;
  title: string;
  month: string;
  status: string;
  mode: string;
  prizePool: number;
  totalParticipants: number;
  winnerName?: string;
  proofStatus?: string;
  seed?: string;
}

export const drawService = {
  async getCurrentDraw() {
    const res = await api.get('/draw/current');
    return res.data.data as DrawPoolItem;
  },

  async simulateDraw(data: { mode?: string; seed?: string }) {
    const res = await api.post('/draw/simulate', data);
    return res.data.data;
  },

  async executeDraw(drawId: string) {
    const res = await api.post('/draw/execute', { drawId });
    return res.data.data;
  },
};
