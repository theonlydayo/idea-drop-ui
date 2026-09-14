import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
} from '@tanstack/react-query';
import { fetchIdea, deleteIdea } from '@/api/ideas';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  CalendarDays,
  Lightbulb,
  Pencil,
  Trash2,
} from 'lucide-react';

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ['idea', ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute('/ideas/$ideaId/')({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const navigate = useNavigate();
  const { user } = useAuth();

  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaId),
    onSuccess: () => {
      navigate({ to: '/ideas' });
    },
  });

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this idea?'
    );

    if (confirmDelete) {
      await deleteMutate();
    }
  };

  return (
    <div className='min-h-[calc(100vh-5rem)] bg-[#f5f7f8]'>
      <div className='mx-auto max-w-4xl px-6 py-10 lg:py-14'>
        <Link
          to='/ideas'
          className='group mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950'
        >
          <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
          Back to ideas
        </Link>

        <article className='overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm'>
          {idea.image && (
            <div className='h-72 w-full overflow-hidden bg-gray-100 sm:h-96'>
              <img
                src={idea.image}
                alt={idea.title}
                className='h-full w-full object-cover'
              />
            </div>
          )}

          <div className='p-7 sm:p-10 lg:p-12'>
            <header>
              <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-100 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-600'>
                <Lightbulb className='h-4 w-4' />
                Idea
              </div>

              <h1 className='text-4xl font-semibold leading-[1.1] tracking-tight text-gray-950 sm:text-5xl'>
                {idea.title}
              </h1>

              <p className='mt-6 max-w-3xl text-lg leading-8 text-gray-500'>
                {idea.summary}
              </p>

              <div className='mt-7 flex items-center gap-2 text-sm text-gray-400'>
                <CalendarDays className='h-4 w-4' />
                <span>
                  Created {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </header>

            <div className='my-10 h-px bg-gray-100' />

            <section>
              <div className='mb-6 flex items-center gap-3'>
                <div className='h-1 w-8 rounded-full bg-blue-600' />

                <h2 className='text-sm font-semibold uppercase tracking-widest text-gray-400'>
                  About this idea
                </h2>
              </div>

              <p className='whitespace-pre-line text-base leading-8 text-gray-600 sm:text-lg sm:leading-9'>
                {idea.description}
              </p>
            </section>

            {idea.tags && idea.tags.length > 0 && (
              <section className='mt-12 border-t border-gray-100 pt-8'>
                <p className='mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400'>
                  Topics
                </p>

                <div className='flex flex-wrap gap-2'>
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>

        {user && user.id === idea.user && (
          <section className='mt-10 border-t border-gray-200 pt-8'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm font-semibold text-gray-900'>
                  Manage this idea
                </p>

                <p className='mt-1 text-sm text-gray-400'>
                  Update your idea or remove it from IdeaDrop.
                </p>
              </div>

              <div className='flex gap-3'>
                <Link
                  to='/ideas/$ideaId/edit'
                  params={{ ideaId }}
                  className='inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600'
                >
                  <Pencil className='h-4 w-4' />
                  Edit
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className='inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Trash2 className='h-4 w-4' />
                  {isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}