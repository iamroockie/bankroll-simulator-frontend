import type { Theme } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
  const themeCookie = cookies.get('theme') as Theme | undefined;

  return {
    theme: themeCookie || 'system',
  };
};
