import Link from "next/link";
import PageHeader from "./components/PageHeader";
import Card from "./components/Card";

const sections = [
  {
    href: "/profile",
    title: "Users",
    description: "Manage user accounts",
  },
  {
    href: "/groups",
    title: "Groups",
    description: "Manage groups",
  },
  {
    href: "/group_schedule",
    title: "Schedules",
    description: "Manage group schedules",
  },
];

export default function Home() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="transition-shadow hover:shadow-md">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
