import type { Idea } from '@/types';
import { Link } from '@tanstack/react-router';
import { Lightbulb } from 'lucide-react';
import clsx from 'clsx';

const IdeaCard = ({
  idea,
  button = true,
}: {
  idea: Idea;
  button?: boolean;
}) => {
  const linkClasses = clsx(
    'mt-7 inline-flex items-center text-sm font-semibold transition',
    {
      'h-11 justify-center rounded-xl bg-gray-950 px-5 text-white hover:bg-blue-600':
        button,
      'text-gray-900 hover:text-blue-600': !button,
    }
  );

  return (
    <article className='group flex min-h-[270px] flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl'>
      {idea.image ? (
        <div className='h-52 w-full overflow-hidden bg-gray-100'>
          <img
            src={idea.image}
            alt={idea.title}
            className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
          />
        </div>
      ) : (
        <div className='px-6 pt-6'>
          <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50'>
            <Lightbulb className='h-5 w-5 text-yellow-500' />
          </div>
        </div>
      )}

      <div className='flex flex-1 flex-col justify-between p-6'>
        <div>
          {idea.image && (
            <div className='mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50'>
              <Lightbulb className='h-5 w-5 text-yellow-500' />
            </div>
          )}

          <h2 className='text-xl font-semibold leading-7 tracking-tight text-gray-950'>
            {idea.title}
          </h2>

          <p className='mt-3 line-clamp-3 text-sm leading-6 text-gray-500'>
            {idea.summary}
          </p>

          {idea.tags && idea.tags.length > 0 && (
            <div className='mt-5 flex flex-wrap gap-2'>
              {idea.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className='rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          to='/ideas/$ideaId'
          params={{ ideaId: idea._id.toString() }}
          className={linkClasses}
        >
          {button ? 'View idea' : 'Read more'}
        </Link>
      </div>
    </article>
  );
};

export default IdeaCard;