"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  id: string;
}

const NotePreview = ({ id }: NotePreviewProps) => {
  const router = useRouter();

  const closeModal = () => {
    router.back();
  };

  const { data: note, isLoading, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={closeModal}>
        <div className={css.container}>
          <p>Loading, please wait...</p>
        </div>
      </Modal>
    );
  }

  if (error || !note) {
    return (
      <Modal onClose={closeModal}>
        <div className={css.container}>
          <p>Failed to load note.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          {note.tag && <p className={css.tag}>{note.tag}</p>}
          <p className={css.date}>
            {new Date(note.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreview;