import type { CollectionConfig } from 'payload'

import { requirePermission } from './helpers/access'
import { autoPublishDate } from './hooks/autoPublishDate'

/**
 * Framework-owned static pages (about, contact, landing sections, …): one
 * collection addressed by `slug`, never one collection per page. Adding a new
 * static page is a data row, not a schema change + migration.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Framework',
    defaultColumns: ['title', 'slug', 'published', 'updatedAt'],
    preview: (doc) => {
      const slug = doc?.slug as string | undefined
      return slug ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${slug}?preview=true` : null
    },
  },
  // Read is public; writes require the `content.write` permission (admins
  // always pass). Published-only visibility is enforced at the query layer
  // (frontend + getPage skill), mirroring BlogPosts.
  access: {
    create: requirePermission('content.write'),
    read: () => true,
    update: requirePermission('content.write'),
    delete: requirePermission('content.write'),
  },
  hooks: {
    beforeChange: [autoPublishDate],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path, e.g. about',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
