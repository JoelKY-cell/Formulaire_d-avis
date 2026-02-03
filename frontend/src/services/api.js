import axios from 'axios';

// Détecter si on est sur mobile/réseau local
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  // Utiliser la même IP que le frontend
  return `http://${window.location.hostname}:8000/api`;
};

const API_BASE_URL = getApiBaseUrl();

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHello = () => apiService.get('/hello/');
export const testEndpoint = (data = null) => {
  if (data) {
    return apiService.post('/test/', data);
  }
  return apiService.get('/test/');
};

export default apiService;