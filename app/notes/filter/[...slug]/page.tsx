import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function NotesByTags({
  params,
}: {
  params: { slug?: string[] };
}) {
  const initialPage = 1;
  const initialSearch = '';
  const perPage = 12;
  const tag = params.slug?.[0] === 'All' ? undefined : params.slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: initialSearch, page: initialPage, perPage, tag }],
    queryFn: () =>
      fetchNotes({
        search: initialSearch,
        page: initialPage,
        perPage,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
