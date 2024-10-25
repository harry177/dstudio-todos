import axios from 'axios';

const API_URL = 'http://api.calmplete.net/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});