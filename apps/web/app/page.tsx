import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <Link href="/profile" className="mt-4 text-blue-500 underline">
        Go to Profile Page
      </Link>
      <Link href="/groups" className="mt-4 text-blue-500 underline">
        Go to Groups Page
      </Link>
    </main>
  );
}
