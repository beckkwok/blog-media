import type { CollectionConfig } from 'payload'

import { requirePermission } from './helpers/access'

/**
 * SocialPosts — writer agent output: blog draft + IG caption drafts.
 * Write gated by `social.write` permission; read public.
 */
export const SocialPosts: CollectionConfig = {
  slug: 'socialposts',
  admin: {
    useAsTitle: 'caption',
    group: 'AI Content',
    defaultColumns: ['idea', 'caption', 'status', 'createdAt'],
  },
  access: {
    create: requirePermission('social.write'),
    read: () => true,
    update: requirePermission('social.write'),
    delete: requirePermission('social.write'),
  },
  fields: [
    {
      name: 'idea',
      type: 'relationship',
      relationTo: 'ideadrafts',
    },
    {
      name: 'blogPost',
      type: 'relationship',
      relationTo: 'blog-posts',
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'hashtags',
      type: 'text',
    },
    {
      name: 'imagePrompt',
      type: 'textarea',
      admin: {
        description: 'Prompt for an accompanying image (optional).',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'draft', value: 'draft' },
        { label: 'approved', value: 'approved' },
        { label: 'published', value: 'published' },
      ],
    },
    {
      name: 'igMediaId',
      type: 'text',
      admin: {
        description: 'Instagram media container id (filled after publishInstagram job).',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}