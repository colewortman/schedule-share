"use client";

import { useEffect, useState, useCallback } from "react";
import { groupService } from "../services/groupService";
import { Group } from "../types";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import GroupForm from "../components/GroupForm";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getAll();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreate = async (data: { group_name: string }) => {
    await groupService.create(data);
    setModalOpen(false);
    fetchGroups();
  };

  const handleEdit = async (data: { group_name: string }) => {
    if (!editingGroup) return;
    await groupService.update(editingGroup.group_id, data);
    setEditingGroup(null);
    fetchGroups();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    await groupService.delete(id);
    fetchGroups();
  };

  return (
    <>
      <PageHeader
        title="Groups"
        action={
          <Button onClick={() => setModalOpen(true)}>Add Group</Button>
        }
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={fetchGroups} />}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {groups.length === 0 && (
            <p className="text-gray-500">No groups found.</p>
          )}
          {groups.map((group) => (
            <Card key={group.group_id}>
              <div className="flex items-center justify-between">
                <p className="font-medium">{group.group_name}</p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingGroup(group)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(group.group_id)}
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
        title="Create Group"
      >
        <GroupForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        title="Edit Group"
      >
        {editingGroup && (
          <GroupForm
            initialData={{ group_name: editingGroup.group_name }}
            onSubmit={handleEdit}
            onCancel={() => setEditingGroup(null)}
          />
        )}
      </Modal>
    </>
  );
}
