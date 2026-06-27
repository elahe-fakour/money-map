import { expect, test } from '@playwright/test'

test('opens the Persian dashboard and navigates to transactions', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'داشبورد' })).toBeVisible()

  await page.getByRole('link', { name: /تراکنش/ }).first().click()

  await expect(page.getByRole('heading', { name: 'تراکنش‌ها' })).toBeVisible()
  await expect(page.getByPlaceholder('جست‌وجو بر اساس یادداشت، دسته یا حساب')).toBeVisible()
})

