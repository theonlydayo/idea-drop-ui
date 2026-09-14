import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Lightbulb, Sparkles, X } from 'lucide-react';
import { createIdea } from '@/api/ideas';
import { uploadImage } from '@/api/cloudinary';

export const Route = createFileRoute('/ideas/new/')({
  component: NewIdeaPage,
});

function NewIdeaPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({ to: '/ideas' });
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

    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      let imageUrl: string | undefined;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      await mutateAsync({
        title,
        summary,
        description,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ''),
        image: imageUrl,
      });
    } catch (error) {
      console.error(error);
      alert('Something went wrong while creating your idea.');
    }
  };

  return (
    <div className='min-h-[calc(100vh-5rem)] bg-[#f8fafc]'>
      <div className='mx-auto max-w-4xl px-6 py-10 lg:py-12'>
        <div className='mb-10'>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-100 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-600'>
            <Lightbulb className='h-4 w-4' />
            Share an idea
          </div>

          <h1 className='max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-gray-950 sm:text-5xl'>
            Turn your idea into something worth building.
          </h1>

          <p className='mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg'>
            Share what you have in mind with the IdeaDrop community. A clear
            idea can inspire conversations, improvements, and collaboration.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='rounded-[2rem] border border-gray-100 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.18)] sm:p-9 lg:p-10'
        >
          <div className='mb-8 flex items-center gap-3 border-b border-gray-100 pb-7'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50'>
              <Sparkles className='h-5 w-5 text-blue-600' />
            </div>

            <div>
              <p className='text-sm font-semibold text-gray-900'>
                Idea details
              </p>

              <p className='mt-0.5 text-xs text-gray-400'>
                Tell us what you are thinking about.
              </p>
            </div>
          </div>

          <div className='space-y-6'>
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
                className='h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
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
                className='h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
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
                rows={8}
                className='w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
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
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className='h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
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

          <div className='mt-8 flex flex-col gap-5 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-700'>
                Ready to share?
              </p>

              <p className='mt-1 text-xs text-gray-400'>
                Your idea will be visible to the IdeaDrop community.
              </p>
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='h-12 rounded-xl bg-gray-950 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isPending ? 'Creating...' : 'Create idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}