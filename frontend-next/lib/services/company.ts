import { Company } from '@/lib/types/company';
import { BaseService, BaseListResponse } from './base';

interface CompaniesResponse extends BaseListResponse {
  companies: Company[];
}

class CompaniesService extends BaseService<Company, CompaniesResponse> {
  constructor() {
    super('companies');
  }
}

export const companiesService = new CompaniesService(); 