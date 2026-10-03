import type { CollectionConfig } from 'payload'

import { requirePermission } from './helpers/access'

/**
 * IdeaDrafts — research agent output: weekly AI-education topic drafts.
 * Write gated by `research.write` permission; read public for approved drafts.
 */
export const IdeaDrafts: CollectionConfig = {
  slug: 'ideadrafts',
  admin: {
    useAsTitle: 'topic',
    group: 'AI Content',
    defaultColumns: ['topic', 'status', 'createdAt'],
  },
  access: {
    create: requirePermission('research.write'),
    read: () => true,
    update: requirePermission('research.write'),
    delete: requirePermission('research.write'),
  },
  fields: [
    {
      name: 'topic',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'sources',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      name: 'angle',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'proposed',
      options: [
        { label: 'proposed', value: 'proposed' },
        { label: 'approved', value: 'approved' },
        { label: 'rejected', value: 'rejected' },
      ],
    },
    {
      name: 'originAgent',
      type: 'text',
      admin: {
        description: 'Agent name or id that produced this draft.',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}