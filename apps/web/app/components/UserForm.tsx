"use client";

import { FormEvent, useState } from "react";
import Button from "./Button";

interface UserFormProps {
  initialData?: { user_name: string; email: string };
  onSubmit: (data: {
    user_name: string;
    email: string;
    password?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({
  initialData,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const isEdit = !!initialData;
  const [userName, setUserName] = useState(initialData?.user_name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        user_name: userName,
        email,
        ...(isEdit ? {} : { password }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Username
        <input
          className={inputClass}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          disabled={submitting}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={submitting}
        />
      </label>
      {!isEdit && (
        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting}
          />
        </label>
      )}
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
