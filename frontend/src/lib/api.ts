import axios from 'axios';
import type { HRESInputParams, HRESOutputResults, DailyProfile } from '@/types/hres';

const API_BASE_URL = '/api';

export const hresApi = {
  // Calculate instant simulation results
  async calculateInstant(params: HRESInputParams): Promise<HRESOutputResults> {
    const response = await axios.post<HRESOutputResults>(
      `${API_BASE_URL}/simulate/instant`,
      params
    );
    return response.data;
  },

  // Run 24-hour simulation
  async simulate24Hours(baseParams: Partial<HRESInputParams>): Promise<DailyProfile> {
    const response = await axios.post<DailyProfile>(
      `${API_BASE_URL}/simulate/daily`,
      baseParams
    );
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },
};
