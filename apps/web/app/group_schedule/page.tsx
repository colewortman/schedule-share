"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { scheduleService } from "../services/scheduleService";

export default function GroupSchedulePage() {
  const [allSchedules, setAllSchedules] = useState<
    Array<{
      schedule_id: string;
      user_id: string | null;
      group_id: string | null;
    }>
  >([]);

  useEffect(() => {
    scheduleService.getAll().then((schedules) => {
      setAllSchedules(schedules);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Group Schedules</h1>
      <ul>
        {allSchedules.map((schedule) => (
          <li key={schedule.schedule_id} className="mt-2">
            Schedule ID: {schedule.schedule_id}, User ID:{" "}
            {schedule.user_id ?? "N/A"}, Group ID: {schedule.group_id ?? "N/A"}
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-4 text-blue-500 underline">
        Back to Home
      </Link>
    </main>
  );
}
