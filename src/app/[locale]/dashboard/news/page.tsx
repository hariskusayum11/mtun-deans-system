import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewsClient from "./news-client";

// Mock Data for News Management
const MOCK_NEWS = [
  {
    id: "n1",
    headline: "MTUN Hosts International Technical Symposium 2025",
    date: new Date("2025-12-15"),
    category: "Academic",
    status: "Published",
  },
  {
    id: "n2",
    headline: "UTeM Launches New Advanced Manufacturing Research Centre",
    date: new Date("2025-12-10"),
    category: "Event",
    status: "Published",
  },
  {
    id: "n3",
    headline: "UMPSA Partners with Petronas for Sustainable Energy Research",
    date: new Date("2025-12-05"),
    category: "Research",
    status: "Draft",
  },
  {
    id: "n4",
    headline: "UTHM Researchers Develop AI for Smart Agriculture",
    date: new Date("2025-11-28"),
    category: "Academic",
    status: "Published",
  },
  {
    id: "n5",
    headline: "UniMAP Students Win National Robotics Competition",
    date: new Date("2025-11-20"),
    category: "Event",
    status: "Published",
  },
];

export default async function NewsManagementPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return <NewsClient initialNews={MOCK_NEWS} />;
}
