import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

export default async function Notes() {
  const page = 1;
  const perPage = 12;
  const search = "";
  const tag = undefined; // для "All" передаём undefined или пустую строку

  const initialData: FetchNotesResponse = await fetchNotes(page, perPage, search, tag);

  return (
    <NotesClient initialData={initialData} tag="All" />
  );
}
