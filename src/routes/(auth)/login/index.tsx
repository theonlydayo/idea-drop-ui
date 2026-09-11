import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: '/ideas' });
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    await mutateAsync({ email, password });
  };

  return (
    <div className='min-h-screen bg-[#f5f7f8]'>
      <div className='min-h-screen grid lg:grid-cols-[0.85fr_1.15fr]'>
        <section className='flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24'>
          <div className='w-full max-w-md'>
            <div className='mb-12'>
              <Link
                to='/'
                className='inline-flex items-center gap-2 text-gray-900'
              >
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-500'>
                  <Lightbulb className='h-5 w-5' />
                </div>

                <span className='text-xl font-bold tracking-tight'>
                  IdeaDrop
                </span>
              </Link>
            </div>

            <div className='mb-8'>
              <p className='mb-3 text-sm font-medium text-blue-600'>
                Welcome back
              </p>

              <h1 className='text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl'>
                Sign in to your account
              </h1>

              <p className='mt-4 max-w-sm text-base leading-7 text-gray-500'>
                Welcome back to IdeaDrop. Sign in to continue exploring,
                sharing, and building great ideas.
              </p>
            </div>

            {error && (
              <div className='mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label
                  htmlFor='email'
                  className='mb-2 block text-sm font-medium text-gray-800'
                >
                  Email address
                </label>

                <input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete='email'
                  className='h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='mb-2 block text-sm font-medium text-gray-800'
                >
                  Password
                </label>

                <input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete='current-password'
                  className='h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                />
              </div>

              <button
                type='submit'
                disabled={isPending}
                className='mt-3 h-14 w-full rounded-2xl bg-gray-950 px-6 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className='mt-8 text-center text-sm text-gray-500'>
              Don't have an account?{' '}
              <Link
                to='/register'
                className='font-semibold text-gray-900 transition hover:text-blue-600'
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>

        <section className='relative hidden overflow-hidden p-5 lg:block'>
          <div className='relative h-full min-h-[700px] overflow-hidden rounded-[2rem] bg-[#101820]'>
            <div className='absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl' />
            <div className='absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl' />

            <div className='relative z-10 flex h-full flex-col p-10 xl:p-14'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-white'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100/10 backdrop-blur'>
                    <Lightbulb className='h-5 w-5 text-yellow-300' />
                  </div>

                  <span className='font-semibold'>IdeaDrop</span>
                </div>

                <div className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300 backdrop-blur'>
                  Your idea hub
                </div>
              </div>

              <div className='mt-auto'>
                <div className='mb-8 max-w-xl'>
                  <h2 className='text-5xl font-semibold leading-[1.05] tracking-tight text-white xl:text-6xl'>
                    Great ideas start with a single thought.
                  </h2>

                  <p className='mt-6 max-w-lg text-base leading-7 text-gray-400'>
                    Capture your ideas, discover what others are building, and
                    turn inspiration into something meaningful.
                  </p>
                </div>

                <div className='relative mt-12 h-64'>
                  <div className='absolute left-0 top-0 w-72 rotate-[-4deg] rounded-3xl border border-white/10 bg-white p-5 shadow-2xl'>
                    <div className='mb-6 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100'>
                          <Lightbulb className='h-5 w-5 text-yellow-500' />
                        </div>

                        <div>
                          <p className='text-sm font-semibold text-gray-900'>
                            Smart workspace
                          </p>
                          <p className='text-xs text-gray-400'>
                            New idea
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight className='h-4 w-4 text-gray-400' />
                    </div>

                    <p className='text-lg font-semibold leading-6 text-gray-900'>
                      A simpler way to turn ideas into projects.
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

                  <div className='absolute right-0 top-12 w-72 rotate-[4deg] rounded-3xl border border-white/10 bg-blue-600 p-6 shadow-2xl'>
                    <div className='mb-10 flex items-center justify-between'>
                      <span className='text-xs font-medium text-blue-100'>
                        Trending idea
                      </span>

                      <ArrowUpRight className='h-5 w-5 text-blue-100' />
                    </div>

                    <p className='text-2xl font-semibold leading-8 text-white'>
                      Build things people actually need.
                    </p>

                    <div className='mt-8 flex items-center justify-between text-xs text-blue-100'>
                      <span>24 votes</span>
                      <span>8 comments</span>
                    </div>
                  </div>
                </div>

                <div className='mt-6 flex items-center gap-3 text-xs text-gray-500'>
                  <div className='h-1.5 w-1.5 rounded-full bg-blue-400' />
                  <span>Share</span>
                  <span>•</span>
                  <span>Discover</span>
                  <span>•</span>
                  <span>Create</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}