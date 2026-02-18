"use client";

import { FormEvent, useState } from "react";
import Button from "./Button";

interface GroupFormProps {
  initialData?: { group_name: string };
  onSubmit: (data: { group_name: string }) => Promise<void>;
  onCancel: () => void;
}

export default function GroupForm({
  initialData,
  onSubmit,
  onCancel,
}: GroupFormProps) {
  const isEdit = !!initialData;
  const [groupName, setGroupName] = useState(initialData?.group_name ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ group_name: groupName });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Group Name
        <input
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          disabled={submitting}
        />
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
