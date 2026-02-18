"use client";

import { useEffect, useState, useCallback } from "react";
import { scheduleService } from "../services/scheduleService";
import { userService } from "../services/userService";
import { groupService } from "../services/groupService";
import { Schedule, User, Group } from "../types";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import ScheduleForm from "../components/ScheduleForm";

export default function GroupSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [schedulesData, usersData, groupsData] = await Promise.all([
        scheduleService.getAll(),
        userService.getAll(),
        groupService.getAll(),
      ]);
      setSchedules(schedulesData);
      setUsers(usersData);
      setGroups(groupsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load schedules"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getUserName = (id: string | null) =>
    users.find((u) => u.user_id === id)?.user_name ?? "N/A";

  const getGroupName = (id: string | null) =>
    groups.find((g) => g.group_id === id)?.group_name ?? "N/A";

  const handleCreate = async (data: {
    user_id: string | null;
    group_id: string | null;
  }) => {
    await scheduleService.create(data);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    await scheduleService.delete(id);
    fetchData();
  };

  return (
    <>
      <PageHeader
        title="Schedules"
        action={
          <Button onClick={() => setModalOpen(true)}>Add Schedule</Button>
        }
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {schedules.length === 0 && (
            <p className="text-gray-500">No schedules found.</p>
          )}
          {schedules.map((schedule) => (
            <Card key={schedule.schedule_id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Schedule {schedule.schedule_id.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    User: {getUserName(schedule.user_id)} | Group:{" "}
                    {getGroupName(schedule.group_id)}
                  </p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(schedule.schedule_id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Schedule"
      >
        <ScheduleForm
          users={users}
          groups={groups}
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </>
  );
}
