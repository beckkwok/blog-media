import type { CollectionConfig } from 'payload'

import { requirePermission } from './helpers/access'

/**
 * Projects — portfolio showcase entries (app-layer collection).
 * Public read; writes require the `content.write` permission (admins always pass).
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['title', 'featured', 'order', 'updatedAt'],
  },
  access: {
    create: requirePermission('content.write'),
    read: () => true,
    update: requirePermission('content.write'),
    delete: requirePermission('content.write'),
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
        description: 'URL path, e.g. ai-tutor',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'stack',
      type: 'array',
      fields: [
        {
          name: 'tech',
          type: 'text',
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Live project URL.',
      },
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'Source code URL.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order (highest first).',
      },
    },
  ],
}
