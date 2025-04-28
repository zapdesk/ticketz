import { AxiosInstance, AxiosError } from 'axios';
import { api } from './auth';

export interface BaseListResponse {
  count: number;
  hasMore: boolean;
}

export class BaseService<T, ListResponse extends BaseListResponse> {
  protected endpoint: string;
  protected api: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.api = api;
  }

  async list(): Promise<ListResponse> {
    try {
      const { data } = await this.api.get(`/${this.endpoint}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${this.endpoint}:`, error);
      throw new Error(`Failed to fetch ${this.endpoint}`);
    }
  }

  async find(id: string): Promise<T> {
    try {
      const { data } = await this.api.get(`/${this.endpoint}/${id}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${this.endpoint}:`, error);
      throw new Error(`Failed to fetch ${this.endpoint}`);
    }
  }

  async create(itemData: Partial<T>): Promise<T> {
    try {
      const { data } = await this.api.post(`/${this.endpoint}`, itemData);
      return data;
    } catch (error) {
      console.error(`Failed to create ${this.endpoint}:`, error);
      throw new Error(`Failed to create ${this.endpoint}`);
    }
  }

  async update(id: string, itemData: Partial<T>): Promise<T> {
    try {

      console.log('itemData:');
      console.log(itemData);
      const { data } = await this.api.put(`/${this.endpoint}/${id}`, itemData);
      return data;
    } catch (error) {
      console.error(`Failed to update ${this.endpoint}:`, error);
      throw new Error(`Failed to update ${this.endpoint}`);
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await this.api.delete(`/${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Failed to delete ${this.endpoint}:`, error);
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new Error(`${this.endpoint} not found`);
      }
      throw new Error(`Failed to delete ${this.endpoint}`);
    }
  }
} 