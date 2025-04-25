import { Company } from '@/types/company';
import axios from 'axios';
import { auth } from '@/services/auth';

interface CompaniesResponse {
  companies: Company[];
  count: number;
  hasMore: boolean;
}

class CompaniesService {
  private baseUrl: string;
  private api;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    this.api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = auth.getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async list(): Promise<CompaniesResponse> {
    try {
      const { data } = await this.api.get('/companies');
      return data;
    } catch (error) {
      throw new Error('Failed to fetch companies');
    }
  }

  async find(id: string): Promise<Company> {
    try {
      const { data } = await this.api.get(`/companies/${id}`);
      return data;
    } catch (error) {
      throw new Error('Failed to fetch company');
    }
  }

  async create(companyData: Partial<Company>): Promise<Company> {
    try {
      const { data } = await this.api.post('/companies', companyData);
      return data;
    } catch (error) {
      throw new Error('Failed to create company');
    }
  }

  async update(id: string, companyData: Partial<Company>): Promise<Company> {
    try {
      const { data } = await this.api.put(`/companies/${id}`, companyData);
      return data;
    } catch (error) {
      throw new Error('Failed to update company');
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await this.api.delete(`/companies/${id}`);
      // If we reach this point, the deletion was successful
      return;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Company not found');
      }
      throw new Error('Failed to delete company');
    }
  }
}

export const companies = new CompaniesService();