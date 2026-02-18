"use client";

import { useEffect, useState, useCallback } from "react";
import { userService } from "../services/userService";
import { User } from "../types";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";

export default function ProfilePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (data: {
    user_name: string;
    email: string;
    password?: string;
  }) => {
    await userService.create(
      data as { user_name: string; email: string; password: string }
    );
    setModalOpen(false);
    fetchUsers();
  };

  const handleEdit = async (data: { user_name: string; email: string }) => {
    if (!editingUser) return;
    await userService.update(editingUser.user_id, data);
    setEditingUser(null);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await userService.delete(id);
    fetchUsers();
  };

  return (
    <>
      <PageHeader
        title="Users"
        action={
          <Button onClick={() => setModalOpen(true)}>Add User</Button>
        }
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={fetchUsers} />}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {users.length === 0 && (
            <p className="text-gray-500">No users found.</p>
          )}
          {users.map((user) => (
            <Card key={user.user_id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.user_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.user_id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create User"
      >
        <UserForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        {editingUser && (
          <UserForm
            initialData={{
              user_name: editingUser.user_name,
              email: editingUser.email,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </Modal>
    </>
  );
}
