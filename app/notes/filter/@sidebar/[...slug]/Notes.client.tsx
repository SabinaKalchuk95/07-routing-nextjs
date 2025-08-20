"use client";

import { useState, useEffect } from "react";
import { useQuery,  useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./Notes.client.module.css";

import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";
import type { Note } from "../../../../../types/note";
import type { FetchNotesResponse } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import ErrorMessage from "../[...slug]/error";
import toast, { Toaster } from "react-hot-toast";

type NotesClientProps = {
  initialData: FetchNotesResponse;
  tag: string;
  perPage?: number;
};

export default function NotesClient({
  initialData,
  tag,
  perPage = 12,
}: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    setSearch("");
    setInputValue("");
    setCurrentPage(1);
  }, [tag]);


  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 1000);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };


  const queryClient = useQueryClient(); 
 const { data, isLoading, isError, isSuccess, error } = useQuery<FetchNotesResponse>({
  queryKey: ["notes", currentPage, search, tag],
  queryFn: () => fetchNotes(currentPage, perPage, search, tag),
  initialData: currentPage === 1 && search === "" ? initialData : undefined,
  placeholderData: keepPreviousData,
});

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;


  useEffect(() => {
    if (isSuccess && !isLoading && notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, isLoading, notes.length]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange} />
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

     {isError && error && (
  <ErrorMessage
    error={error as Error}
    reset={() => queryClient.invalidateQueries({ queryKey: ["notes"] })}
  />
)}


      {notes.length === 0 && !isLoading && (
        <p className={css.centered}>No notes found.</p>
      )}

      {notes.length > 0 && <NoteList notes={notes} />}

      {totalPages > 1 && (
       <Pagination
  totalNumberOfPages={totalPages}
  currentActivePage={currentPage}
  setPage={setCurrentPage}
/>

      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}