import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useMutation,
  useSuspenseQuery,
  queryOptions,
} from '@tanstack/react-query';
import { fetchIdea, updateIdea } from '@/api/ideas';
import { uploadImage } from '@/api/cloudinary';
import { ArrowLeft, ImagePlus, Pencil, X } from 'lucide-react';

const ideaQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['idea', id],
    queryFn: () => fetchIdea(id),
  });

export const Route = createFileRoute('/ideas/$ideaId/edit')({
  component: IdeaEditPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaEditPage() {
  const { ideaId } = Route.useParams();
  const navigate = useNavigate();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const [title, setTitle] = useState(idea.title);
  const [summary, setSummary] = useState(idea.summary);
  const [description, setDescription] = useState(idea.description);
  const [tagsInput, setTagsInput] = useState(idea.tags.join(', '));

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(idea.image || '');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      let imageUrl = idea.image;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      return updateIdea(ideaId, {
        title,
        summary,
        description,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        image: imageUrl,
      });
    },
    onSuccess: () => {
      navigate({
        to: '/ideas/$ideaId',
        params: { ideaId },
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await mutateAsync();
    } catch (error) {
      console.error(error);
      alert('Something went wrong while updating your idea.');
    }
  };

  return (
    <div className='min-h-[calc(100vh-5rem)] bg-[#f5f7f8]'>
      <div className='mx-auto max-w-4xl px-6 py-10 lg:py-14'>
        <Link
          to='/ideas/$ideaId'
          params={{ ideaId }}
          className='group mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950'
        >
          <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
          Back to idea
        </Link>

        <div className='mb-10'>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600'>
            <Pencil className='h-4 w-4' />
            Edit idea
          </div>

          <h1 className='text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl'>
            Refine your idea
          </h1>

          <p className='mt-4 max-w-2xl text-base leading-7 text-gray-500'>
            Update your idea details and make sure everything accurately
            represents what you want to share with the community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm sm:p-9 lg:p-10'
        >
          <div className='space-y-7'>
            <div>
              <label
                htmlFor='title'
                className='mb-2 block text-sm font-semibold text-gray-800'
              >
                Idea title
              </label>

              <input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                placeholder='Give your idea a clear title'
              />
            </div>

            <div>
              <label
                htmlFor='summary'
                className='mb-2 block text-sm font-semibold text-gray-800'
              >
                Summary
              </label>

              <input
                id='summary'
                type='text'
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className='h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                placeholder='Describe your idea in one sentence'
              />
            </div>

            <div>
              <label
                htmlFor='body'
                className='mb-2 block text-sm font-semibold text-gray-800'
              >
                Description
              </label>

              <textarea
                id='body'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={9}
                className='w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                placeholder='Tell the community more about your idea...'
              />
            </div>

            <div>
              <label
                htmlFor='tags'
                className='mb-2 block text-sm font-semibold text-gray-800'
              >
                Tags
              </label>

              <input
                id='tags'
                type='text'
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className='h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                placeholder='startup, productivity, technology'
              />

              <p className='mt-2 text-xs text-gray-400'>
                Separate multiple tags with commas.
              </p>
            </div>

            <div>
              <label
                htmlFor='image'
                className='mb-2 block text-sm font-semibold text-gray-800'
              >
                Idea image
              </label>

              {!imagePreview ? (
                <label
                  htmlFor='image'
                  className='flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/40'
                >
                  <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm'>
                    <ImagePlus className='h-5 w-5 text-blue-600' />
                  </div>

                  <p className='text-sm font-semibold text-gray-800'>
                    Upload an image
                  </p>

                  <p className='mt-1 text-xs text-gray-400'>
                    JPG, PNG or WebP · Max 5MB
                  </p>

                  <input
                    id='image'
                    type='file'
                    accept='image/jpeg,image/png,image/webp'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </label>
              ) : (
                <div className='relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50'>
                  <img
                    src={imagePreview}
                    alt='Idea preview'
                    className='h-72 w-full object-cover'
                  />

                  <button
                    type='button'
                    onClick={removeImage}
                    className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black'
                    aria-label='Remove image'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className='mt-10 flex flex-col gap-4 border-t border-gray-100 pt-7 sm:flex-row sm:items-center sm:justify-between'>
            <Link
              to='/ideas/$ideaId'
              params={{ ideaId }}
              className='text-center text-sm font-medium text-gray-500 transition hover:text-gray-900 sm:text-left'
            >
              Cancel
            </Link>

            <button
              type='submit'
              disabled={isPending}
              className='inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-950 px-8 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Pencil className='h-4 w-4' />
              {isPending ? 'Updating...' : 'Update idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}