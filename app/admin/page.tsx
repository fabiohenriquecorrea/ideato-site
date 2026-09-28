import { Editor } from "@/components/admin/Editor";
import { getContent, getStatus } from "@/lib/content";

export default function AdminPage() {
  // cópia do conteúdo no momento da geração: usada no modo local (sem GitHub)
  return <Editor initial={{ content: getContent(), status: getStatus() }} />;
}
