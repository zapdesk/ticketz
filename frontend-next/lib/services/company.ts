import axios from 'axios';
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export interface Company {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  // Add any other fields that your backend returns
}

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/companies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}; 