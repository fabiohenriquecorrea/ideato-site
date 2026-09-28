import { HomeView } from "@/components/views/HomeView";
import { getContent } from "@/lib/content";

export default function Home() {
  return <HomeView content={getContent()} />;
}
