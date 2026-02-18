"use client";

import { FormEvent, useState } from "react";
import { User, Group } from "../types";
import Button from "./Button";

interface ScheduleFormProps {
  initialData?: { user_id: string | null; group_id: string | null };
  users: User[];
  groups: Group[];
  onSubmit: (data: {
    user_id: string | null;
    group_id: string | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ScheduleForm({
  initialData,
  users,
  groups,
  onSubmit,
  onCancel,
}: ScheduleFormProps) {
  const isEdit = !!initialData;
  const [userId, setUserId] = useState(initialData?.user_id ?? "");
  const [groupId, setGroupId] = useState(initialData?.group_id ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        user_id: userId || null,
        group_id: groupId || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        User
        <select
          className={selectClass}
          value={userId ?? ""}
          onChange={(e) => setUserId(e.target.value)}
          disabled={submitting}
        >
          <option value="">None</option>
          {users.map((u) => (
            <option key={u.user_id} value={u.user_id}>
              {u.user_name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Group
        <select
          className={selectClass}
          value={groupId ?? ""}
          onChange={(e) => setGroupId(e.target.value)}
          disabled={submitting}
        >
          <option value="">None</option>
          {groups.map((g) => (
            <option key={g.group_id} value={g.group_id}>
              {g.group_name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
