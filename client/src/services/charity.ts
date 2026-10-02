import api from './api';

export interface CharityItem {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  totalRaised: number;
  mealsProvided: number;
  treesPlanted: number;
  educationUnits: number;
  verified: boolean;
}

export const charityService = {
  async getImpactMap() {
    const res = await api.get('/charity/map');
    return res.data.data as {
      charities: CharityItem[];
      totals: { totalRaised: number; mealsProvided: number; treesPlanted: number; educationUnits: number };
    };
  },

  async getMyImpact() {
    const res = await api.get('/charity/my-impact');
    return res.data.data;
  },
};
