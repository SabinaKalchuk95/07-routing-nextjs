import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const queryClient = new QueryClient();

  const note = await queryClient.fetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  if (!note) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={params.id} />
    </HydrationBoundary>
  );
}
