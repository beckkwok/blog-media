import { test, expect } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import { plainTextToLexical } from '../../src/lib/lexical'

const BASE = 'http://localhost:3000'

let aboutSlug: string
let draftSlug: string

test.describe('Static pages (framework Page collection)', () => {
  test.beforeAll(async () => {
    const payload = await getPayload({ config: await config })
    const stamp = Date.now()
    aboutSlug = `e2e-about-${stamp}`
    draftSlug = `e2e-draft-${stamp}`

    await payload.create({
      collection: 'pages',
      data: {
        title: 'E2E About',
        slug: aboutSlug,
        content: plainTextToLexical('E2E about body text.'),
        published: true,
      },
      overrideAccess: true,
    })
    await payload.create({
      collection: 'pages',
      data: {
        title: 'E2E Draft',
        slug: draftSlug,
        content: plainTextToLexical('E2E draft body text.'),
        published: false,
      },
      overrideAccess: true,
    })
  })

  test('renders a published page at /{slug} with no code change', async ({ page }) => {
    await page.goto(`${BASE}/${aboutSlug}`)
    await expect(page.locator('h1')).toHaveText('E2E About')
    await expect(page.locator('article')).toContainText('E2E about body text.')
  })

  test('unpublished pages return 404', async ({ request }) => {
    const res = await request.get(`${BASE}/${draftSlug}`)
    expect(res.status()).toBe(404)
  })
})
