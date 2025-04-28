'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import UserList from './components/UserList';
import UserModal from './components/UserModal';
import { User } from '@/lib/types/user';
import { usersService } from '@/lib/services/users';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(undefined);
    setIsModalOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (userData: Partial<User>) => {
    try {
      if (selectedUser) {
        await usersService.update(selectedUser.id.toString(), userData);
        toast.success('User updated successfully');
      } else {
        await usersService.create(userData);
        toast.success('User created successfully');
      }
      setRefreshKey((prev) => prev + 1);
      handleCloseModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add User
          </button>
        </div>

        <div className="mt-4">
          <UserList onEdit={handleEditUser} refreshKey={refreshKey} />
        </div>

        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          user={selectedUser}
        />
      </div>
    </div>
  );
} 