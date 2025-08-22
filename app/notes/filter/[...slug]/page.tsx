import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { FetchNotesResponse } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type Props = {
  params: Promise<{ slug?: string[] }>;
};


export default async function NotesByTags({ params }: Props) {
  const { slug } = await params;

  const initialPage = 1;
  const initialSearch = '';
const perPage = 12;
  const tag = slug?.[0] === 'All' ? undefined : slug?.[0];

  const queryClient = new QueryClient();
  const initialData: FetchNotesResponse = await fetchNotes(initialPage, perPage, initialSearch, tag);

  await queryClient.prefetchQuery({
    queryKey: ['notes', initialSearch, initialPage, tag],
    queryFn: () => fetchNotes(initialPage, perPage, initialSearch, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag ?? ''} initialData={initialData} />
    </HydrationBoundary>
  );
}