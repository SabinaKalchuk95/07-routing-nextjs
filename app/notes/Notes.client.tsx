"use client"

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api"; 
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css"
import type { FetchNotesResponse } from "@/lib/api"; 
import type { Note } from "@/types/note"; 

interface NotesClientProps {
  initialNotes: FetchNotesResponse;
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };

  const { data, isLoading } = useQuery<FetchNotesResponse>({ 
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    initialData: initialNotes,
    placeholderData: keepPreviousData,
  })

  const totalPages = data?.totalPages ?? 0;

  const notes: Note[] = data?.notes ?? []; 

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange}/>
        {totalPages > 1 && (
        <Pagination totalNumberOfPages={totalPages} currentActivePage={currentPage} setPage={setCurrentPage} />)}
        <button className={css.button} onClick={openModal}>Create note +</button>
      </header>

      {isLoading ? (
        <p className={css.loading}>Loading notes...</p>
      ) : (
        <NoteList notes={notes} />
      )}
      {isModalOpen && ( <Modal onClose={closeModal}>
        <NoteForm onCloseModal={closeModal}/>
      </Modal>
      )}
    </div>
  )
}