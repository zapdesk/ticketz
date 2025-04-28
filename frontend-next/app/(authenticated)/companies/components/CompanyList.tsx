'use client';

import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Company } from '@/lib/types/company';
import { companiesService } from '@/lib/services/company';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface CompanyListProps {
  onEdit: (company: Company) => void;
  refreshKey: number;
}

export default function CompanyList({ onEdit, refreshKey }: CompanyListProps) {
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setIsLoading(true);
        const data = await companiesService.list();
        setCompanyList(data.companies || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to fetch companies');
        setCompanyList([]); // Reset to empty array on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, [refreshKey]);

  const openDeleteDialog = (company: Company) => {
    setCompanyToDelete(company);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setCompanyToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!companyToDelete) return;

    try {
      setDeletingId(companyToDelete.id.toString());
      await companiesService.delete(companyToDelete.id);
      setCompanyList(prevList => prevList.filter(company => company.id !== companyToDelete.id));
      toast.success('Company deleted successfully');
      closeDeleteDialog();
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error('Failed to delete company');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (companyList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No companies found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companyList.map((company) => (
                  <tr key={company.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {company.name || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {company.email || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {company.phone || '-'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => onEdit(company)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        disabled={deletingId === company.id.toString()}
                      >
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteDialog(company)}
                        className={`text-red-600 hover:text-red-900 ${deletingId === company.id.toString() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={deletingId === company.id.toString()}
                      >
                        {deletingId === company.id.toString() ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Company"
        message={`Are you sure you want to delete ${companyToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonStyle="danger"
      />
    </div>
  );
} 