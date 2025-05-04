import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch('/ai/usage');
    const { usage } = await res.json();
    return { usage };
};
