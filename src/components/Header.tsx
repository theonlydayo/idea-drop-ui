import { Link, useNavigate } from '@tanstack/react-router';
import { Lightbulb, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/api/auth';

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser, setAccessToken } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAccessToken(null);
      setUser(null);
      navigate({ to: '/' });
    } catch (err: any) {
      console.log('Logout failed: ', err);
    }
  };

  return (
    <header className='border-b border-gray-100 bg-white'>
      <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10'>
        <Link
          to='/'
          className='flex items-center gap-3 text-gray-950 transition-opacity hover:opacity-80'
        >
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100'>
            <Lightbulb className='h-5 w-5 text-yellow-500' />
          </div>

          <span className='text-xl font-bold tracking-tight'>IdeaDrop</span>
        </Link>

        <div className='flex items-center gap-8'>
          <nav className='hidden items-center gap-2 sm:flex'>
            <Link
              to='/ideas'
              className='rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-950'
            >
              Ideas
            </Link>

            {user && (
              <Link
                to='/ideas/new'
                className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700'
              >
                + New Idea
              </Link>
            )}
          </nav>

          <div className='flex items-center gap-4 border-l border-gray-100 pl-6'>
            {!user ? (
              <>
                <Link
                  to='/login'
                  className='rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-950'
                >
                  Login
                </Link>

                <Link
                  to='/register'
                  className='rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600'
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className='hidden leading-tight md:block'>
                    <p className='text-sm font-semibold text-gray-900'>
                      {user.name}
                    </p>

                    <p className='text-xs text-gray-400'>IdeaDrop member</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600'
                >
                  <LogOut className='h-4 w-4' />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;