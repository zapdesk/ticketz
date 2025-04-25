'use client';

import { useState, useCallback } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import CompanyList from './components/CompanyList';
import CompanyModal from './components/CompanyModal';
import { Company } from '@/types/company';
import { companies } from '@/services/companies';
import { toast } from 'react-hot-toast';

export default function CompaniesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const refreshList = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleSubmit = async (companyData: Partial<Company>) => {
    try {
      if (editingCompany) {
        await companies.update(editingCompany.id, companyData);
        toast.success('Company updated successfully');
      } else {
        await companies.create(companyData);
        toast.success('Company created successfully');
      }
      handleCloseModal();
      refreshList();
    } catch (error) {
      toast.error('Failed to save company');
      throw error;
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your companies and their settings
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleCreateCompany}
            className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      {/* Company List */}
      <div className="mt-8">
        <CompanyList onEdit={handleEditCompany} refreshKey={refreshKey} />
      </div>

      {/* Create/Edit Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        company={editingCompany || undefined}
      />
    </div>
  );
} 