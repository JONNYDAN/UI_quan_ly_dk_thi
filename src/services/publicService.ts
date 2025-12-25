import api from './api';

export const getPublicContent = async () => {
  try {
    const response = await api.get('/all');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get public content failed';
  }
};

export const getSearchResult = async (cccd: string) => {
  try {
    const response = await api.get(`/search/${cccd}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Search failed';
  }
};

export default {
  getPublicContent,
  getSearchResult,
};