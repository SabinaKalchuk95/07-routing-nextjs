import axios from "axios";
import type { Note } from "@/types/note";

// 🔧 Axios базовая конфигурация
axios.defaults.baseURL = "https://notehub-public.goit.study/api/";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// 🔑 Токен из .env.local
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!token) {
  console.warn("⚠️ NoteHub token is missing. Check your .env.local file.");
}

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// 🔁 Глобальный перехватчик ошибок
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      console.error(`❌ Axios error [${status}]:`, message);

      if (status === 401) {
        console.warn("🔒 Unauthorized. Your token may be invalid or expired.");
      }

      if (status === 404) {
        console.warn("⚠️ Not Found. Check the endpoint or query parameters.");
      }
    } else {
      console.error("❌ Unexpected error:", error);
    }

    return Promise.reject(error);
  }
);

// 🔖 Типы
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

// 📥 Получение списка заметок
export const fetchNotes = async (page: number, search: string) => {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeSearch = typeof search === "string" ? search.trim() : "";

  const params: Record<string, string | number> = { page: safePage };
  if (safeSearch) {
    params.search = safeSearch;
  }

  console.log("🔍 Fetching notes with params:", params);
  console.log("🔑 Token:", token);

  const res = await axios.get<FetchNotesResponse>("/notes", { params });
  return res.data;
};

// 📝 Создание заметки
export const createNote = async (newNote: NewNote) => {
  const res = await axios.post<Note>("/notes", newNote);
  return res.data;
};

// 🗑️ Удаление заметки
export const deleteNote = async (noteId: string) => {
  const res = await axios.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

// 📄 Получение заметки по ID
export const fetchNoteById = async (id: string) => {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
};
