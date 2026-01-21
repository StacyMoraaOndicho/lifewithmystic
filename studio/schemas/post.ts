export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'publishedAt', type: 'datetime', title: 'Published at' },
    { name: 'excerpt', type: 'text', title: 'Excerpt' },
    { name: 'author', type: 'reference', to: [{ type: 'author' }] },
    { name: 'body', type: 'array', of: [{ type: 'block' }], title: 'Body (Portable Text)' },
  ],
};
