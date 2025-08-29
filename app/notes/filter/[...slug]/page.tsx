import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface Props {
  params: {
    slug: string[];
  };
}

export default async function NotesByTags({
  params,
}: Props) {
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