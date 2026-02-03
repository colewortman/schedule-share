"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { User } from "../types";

export default function ProfilePage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    userService.getAll().then((users) => {
      setAllUsers(users);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Profile Page</h1>
      <ul>
        {allUsers.map((user) => (
          <li key={user.user_id}>
            {user.user_name} - {user.email}
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-4 text-blue-500 underline">
        Back to Home
      </Link>
    </main>
  );
}
