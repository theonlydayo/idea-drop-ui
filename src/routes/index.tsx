import { createFileRoute, Link } from '@tanstack/react-router';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchIdeas } from '@/api/ideas';
import IdeaCard from '@/components/IdeaCard';

const ideasQueryOptions = queryOptions({
  queryKey: ['ideas', { limit: 3 }],
  queryFn: () => fetchIdeas(3),
});

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(ideasQueryOptions),
});

function HomePage() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions);

  return (
    <div className='min-h-[calc(100vh-5rem)] bg-[#f5f7f8]'>
      <section className='relative overflow-hidden'>
        <div className='absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl' />
        <div className='absolute -left-32 top-40 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl' />

        <div className='relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10 lg:py-28'>
          <div className='grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]'>
            <div>
              <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600'>
                <Sparkles className='h-4 w-4' />
                Ideas worth building
              </div>

              <h1 className='max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl'>
                Turn your ideas into{' '}
                <span className='text-blue-600'>something great.</span>
              </h1>

              <p className='mt-6 max-w-xl text-lg leading-8 text-gray-500'>
                IdeaDrop is a place to share your ideas, discover what others
                are building, and find inspiration for your next project.
              </p>

              <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
                <Link
                  to='/ideas'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600'
                >
                  Explore ideas
                  <ArrowRight className='h-4 w-4' />
                </Link>

                <Link
                  to='/register'
                  className='inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50'
                >
                  Share your idea
                </Link>
              </div>

              <div className='mt-10 flex items-center gap-6 text-sm text-gray-400'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-blue-500' />
                  Share
                </div>

                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-yellow-400' />
                  Discover
                </div>

                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-400' />
                  Build
                </div>
              </div>
            </div>

            <div className='relative hidden h-[430px] lg:block'>
              <div className='absolute left-6 top-8 w-72 rotate-[-6deg] rounded-3xl border border-gray-100 bg-white p-6 shadow-xl'>
                <div className='mb-8 flex items-center justify-between'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100'>
                    <Lightbulb className='h-5 w-5 text-yellow-500' />
                  </div>

                  <span className='rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600'>
                    New idea
                  </span>
                </div>

                <p className='text-xl font-semibold leading-7 text-gray-900'>
                  A simpler way to organize your ideas.
                </p>

                <p className='mt-3 text-sm leading-6 text-gray-400'>
                  Capture thoughts, develop concepts, and turn inspiration
                  into something real.
                </p>

                <div className='mt-6 flex gap-2'>
                  <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                    Product
                  </span>

                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500'>
                    Innovation
                  </span>
                </div>
              </div>

              <div className='absolute right-2 top-28 w-72 rotate-[5deg] rounded-3xl bg-blue-600 p-6 shadow-2xl'>
                <div className='mb-10 flex items-center justify-between'>
                  <span className='text-xs font-medium text-blue-100'>
                    Trending idea
                  </span>

                  <ArrowRight className='h-5 w-5 text-blue-100' />
                </div>

                <p className='text-2xl font-semibold leading-8 text-white'>
                  Build things people actually need.
                </p>

                <div className='mt-8 flex items-center justify-between text-xs text-blue-100'>
                  <span>24 votes</span>
                  <span>8 comments</span>
                </div>
              </div>

              <div className='absolute bottom-0 left-24 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-lg'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100'>
                  <Lightbulb className='h-4 w-4 text-yellow-500' />
                </div>

                <div>
                  <p className='text-sm font-semibold text-gray-900'>
                    What's your next idea?
                  </p>

                  <p className='text-xs text-gray-400'>
                    Share it with the community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='border-t border-gray-100 bg-white'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-10'>
          <div className='mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
            <div>
              <div className='mb-4 flex items-center gap-3'>
                <div className='h-px w-8 bg-blue-600' />

                <span className='text-sm font-semibold uppercase tracking-widest text-blue-600'>
                  Fresh from the community
                </span>
              </div>

              <h2 className='text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl'>
                Latest ideas
              </h2>

              <p className='mt-4 max-w-xl text-base leading-7 text-gray-500'>
                Discover fresh concepts, creative projects, and ideas shared by
                people building something new.
              </p>
            </div>

            <Link
              to='/ideas'
              className='group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-blue-600'
            >
              Explore all ideas

              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} button={false} />
            ))}
          </div>

          <div className='mt-12 flex justify-center'>
            <Link
              to='/ideas'
              className='group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-gray-50'
            >
              Discover more ideas

              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}