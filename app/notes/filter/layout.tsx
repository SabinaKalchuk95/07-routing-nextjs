import css from "./LayoutNotes.module.css";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal?: React.ReactNode; // optional
};

const NotesLayout = ({ children, sidebar, modal }: Props) => {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <main className={css.notesWrapper}>{children}</main>
      {modal && <div className={css.modalWrapper}>{modal}</div>}
    </div>
  );
};

export default NotesLayout;
