// lib/api.ts
import axios from "axios";
import type { Note } from "@/types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
if (!token) {
  console.warn("⚠️ NoteHub token is missing. Check your .env.local file.");
}
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  search?: string;
  perPage?: number;
  tag?: string;
}

export const fetchNotes = async ({
  page = 1,
  search = "",
  perPage = 12,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };

  if (search) params.search = search.trim();
  if (tag) params.tag = tag;

  const res = await axios.get<FetchNotesResponse>("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
};

// Добавляем функцию для создания новой заметки
export const createNote = async (newNote: NewNote): Promise<Note> => {
  const res = await axios.post<Note>("/notes", newNote);
  return res.data;
};

// Добавляем функцию для удаления заметки
export const deleteNote = async (id: string): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${id}`);
  return res.data;
};