import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

export default defineConfig({
  name: 'default',
  title: 'lifewithmystic',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oapgv793',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [deskTool()],

  schema: {
    types: [
      {
        name: 'post',
        title: 'Post',
        type: 'document',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: Rule => Rule.required() },
          { name: 'author', type: 'reference', title: 'Author', to: [{ type: 'author' }] },
          { name: 'publishedAt', type: 'datetime', title: 'Published at', initialValue: (new Date()).toISOString() },
          { name: 'isPremium', type: 'boolean', title: 'Premium Content', description: 'Only available to subscribers', initialValue: false },
          { name: 'excerpt', type: 'text', title: 'Excerpt' },
          { name: 'body', type: 'array', of: [{ type: 'block' }], title: 'Body' },
        ],
      },
      {
        name: 'author',
        title: 'Author',
        type: 'document',
        fields: [
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'image', type: 'image', title: 'Image' },
          { name: 'bio', type: 'text', title: 'Bio' },
          { name: 'stripeConnectId', type: 'string', title: 'Stripe Connect ID', description: 'Used for receiving payments' },
        ],
      },
    ],
  },
});
