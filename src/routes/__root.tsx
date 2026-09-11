import {
  HeadContent,
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        name: 'description',
        content:
          'Share, explore and build on the best startup ideas and side hustles',
      },
      {
        title: 'IdeaDrop - Your Idea Hub',
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isFullWidthPage =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  return (
    <div className='min-h-screen bg-whi'>
      <HeadContent />

      <Header />

      {isFullWidthPage ? (
        <main className='w-full'>
          <Outlet />
        </main>
      ) : (
        <main className='flex justify-center p-6'>
          <div className='w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg'>
            <Outlet />
          </div>
        </main>
      )}

      <TanStackRouterDevtools />
    </div>
  );
}

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <h1 className='mb-4 text-4xl font-bold text-gray-800'>404</h1>

      <p className='mb-6 text-lg text-gray-600'>
        Ooops! The page you are looking for does not exist
      </p>

      <Link
        className='rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700'
        to='/'
      >
        Go Back Home
      </Link>
    </div>
  );
}