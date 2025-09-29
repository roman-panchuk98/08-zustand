"use client";

import { useEffect, useState } from "react";
import fetchNotes from "../../../../lib/api";
import css from "./page.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import Modal from "../../../../components/Modal/Modal";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import toast, { Toaster } from "react-hot-toast";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import { useDebouncedCallback } from "use-debounce";

export default function NotesClient({ tag }: { tag?: string }) {
  const [searchWord, setSearchWord] = useState<string>("");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchWord(event.target.value);
      setPage(1);
    },
    1000,
  );

  const { data } = useQuery({
    queryKey: ["myNoteHubKey", searchWord, page, tag],
    queryFn: () => fetchNotes(searchWord, page, tag),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.notes.length === 0) {
      toast.error("There is nothing on request.");
    }
  }, [data]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        {<SearchBox value={searchWord} onChange={handleChange} />}
        {data && data?.notes.length > 0 && (
          <Pagination
            totalPages={data?.totalPages ?? 0}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
        {
          <button className={css.button} onClick={handleOpenModal}>
            Create note +
          </button>
        }
      </div>
      <Toaster />
      {data && data?.notes.length > 0 && <NoteList notes={data?.notes} />}
      {openModal && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
