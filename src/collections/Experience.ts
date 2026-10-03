import type { CollectionConfig } from 'payload'

import { requirePermission } from './helpers/access'

/**
 * Experience — portfolio timeline entries (app-layer collection).
 * Public read; writes require the `content.write` permission (admins always pass).
 */
export const Experience: CollectionConfig = {
  slug: 'experience',
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['title', 'organization', 'startDate', 'endDate', 'current'],
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
      admin: {
        description: 'Position title, e.g. Senior AI Engineer',
      },
    },
    {
      name: 'organization',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
    },
    {
      name: 'current',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'highlight',
          type: 'text',
        },
      ],
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
