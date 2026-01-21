Sanity Studio scaffold

Files under `studio/` show example schemas for `post` and `author` so you can copy them
into a Sanity Studio project. To create a studio locally:

1. Install the Sanity CLI: `npm i -g @sanity/cli`.
2. Run `sanity init` in a separate folder to create the studio.
3. Copy the `studio/schemas/*` files into your created studio's `schemas` folder and import them in `schema.js`.

This repo includes example schema files only — it doesn't provision a studio for you.
