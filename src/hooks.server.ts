import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html
          .replace('%paraglide.lang%', locale)
          .replace('%paraglide.dir%', getTextDirection(locale)),
    });
  });

const themeHandle: Handle = async ({ event, resolve }) => {
  const theme = event.cookies.get('theme') || '';

  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme),
  });
};

export const handle: Handle = sequence(handleParaglide, themeHandle);
