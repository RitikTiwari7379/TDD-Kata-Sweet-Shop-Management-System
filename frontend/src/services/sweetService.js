import api from './api';

export const getAllSweets = async () => {
  const response = await api.get('/sweets');
  return response.data;
};

export const getSweetById = async (id) => {
  const response = await api.get(`/sweets/${id}`);
  return response.data;
};

export const searchSweets = async (params) => {
  const response = await api.get('/sweets/search', { params });
  return response.data;
};

export const createSweet = async (sweetData) => {
  const response = await api.post('/sweets', sweetData);
  return response.data;
};

export const updateSweet = async (id, sweetData) => {
  const response = await api.put(`/sweets/${id}`, sweetData);
  return response.data;
};

export const deleteSweet = async (id) => {
  const response = await api.delete(`/sweets/${id}`);
  return response.data;
};

export const purchaseSweet = async (id, quantity) => {
  const response = await api.post(`/sweets/${id}/purchase`, { quantity });
  return response.data;
};

export const restockSweet = async (id, quantity) => {
  const response = await api.post(`/sweets/${id}/restock`, { quantity });
  return response.data;
};

export const getPurchaseHistory = async () => {
  const response = await api.get('/sweets/purchases');
  return response.data;
};
