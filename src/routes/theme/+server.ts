import { json } from '@sveltejs/kit';

export const PUT = async ({ request, cookies }) => {
  const { theme } = await request.json();

  if (theme === 'system') {
    cookies.delete('theme', { path: '/' });
  } else {
    cookies.set('theme', theme, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      secure: false,
    });
  }

  return json({ success: true });
};
