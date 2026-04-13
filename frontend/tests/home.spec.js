import { test, expect } from '@playwright/test'

test.describe('Главная страница', () => {
  test('отображает заголовок приложения', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('h1')).toContainText('Календарь звонков')
  })

  test('отображает статус API', async ({ page }) => {
    await page.goto('/')
    
    const statusText = await page.locator('text=Статус системы').textContent()
    expect(statusText).toBeTruthy()
  })

  test('отображает информацию о доступности', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('text=15 или 30 минут')).toBeVisible()
    await expect(page.locator('text=будни 09:00–18:00')).toBeVisible()
  })
})
