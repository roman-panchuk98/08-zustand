import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import fetchNotes from "@/lib/api";
import NoteDetailsClient from "./Notes.client";

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

const Notes = async ({ params }: NotesProps) => {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0];

  const searchWord = "";
  const page = 1;

  await queryClient.prefetchQuery({
    queryKey: ["myNoteHubKey", searchWord, page, tag],
    queryFn: () => fetchNotes(searchWord, page, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient tag={tag} />
    </HydrationBoundary>
  );
};

export default Notes;
