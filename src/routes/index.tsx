import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import Spring from './spring';

export default component$(() => {
  return (
    <Spring></Spring>
  );
});

export const head: DocumentHead = {
  title: 'Spring Module Analyzer',
  meta: [
    {
      name: 'description',
      content: 'Spring Module Analyzer',
    },
  ],
};
