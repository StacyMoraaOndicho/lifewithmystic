export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'bio', type: 'text', title: 'Bio' },
    { name: 'avatar', type: 'image', title: 'Avatar' },
  ],
};
