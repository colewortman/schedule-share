"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { groupService } from "../services/groupService";

export default function GroupsPage() {
  const [allGroups, setAllGroups] = useState<
    Array<{ group_id: string; group_name: string }>
  >([]);

  useEffect(() => {
    groupService.getAll().then(setAllGroups);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Groups Page</h1>
      <ul>
        {allGroups.map((group) => (
          <li key={group.group_id} className="mt-2">
            {group.group_name}
          </li>
        ))}
      </ul>
      <Link href="/group_schedule" className="mt-4 text-blue-500 underline">
        Go to Group Schedule Page
      </Link>
      <Link href="/" className="mt-4 text-blue-500 underline">
        Back to Home
      </Link>
    </main>
  );
}
