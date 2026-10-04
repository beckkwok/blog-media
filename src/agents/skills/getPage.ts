import { z } from 'zod'

import type { Skill } from './types'

/** Gets a single published static page by slug. Access-controlled. */
export const getPage: Skill = {
  name: 'getPage',
  description: 'Get a published static page (about, contact, …) by its slug.',
  parameters: {
    slug: z.string().describe('The page slug.'),
  },
  handler: async (args, ctx) => {
    const slug = String(args.slug ?? '').trim()
    if (!slug) return { page: null }
    const result = await ctx.payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user: ctx.user,
    })
    return { page: result.docs[0] ?? null }
  },
}
