import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { FetchNotesResponse } from "@/lib/api";

interface NotesPageProps {
  params: { slug?: string[] };
}

export default async function NotesByTags({ params }: NotesPageProps) {
  const slug = params.slug ?? ["all"];
  const tag = slug[0] === "all" ? undefined : slug[0];

  const page = 1;
  const perPage = 12;
  const search = "";

  const initialData: FetchNotesResponse = await fetchNotes(page, perPage, search, tag);

  return <NotesClient initialData={initialData} tag={tag ?? "All"} />;
}
