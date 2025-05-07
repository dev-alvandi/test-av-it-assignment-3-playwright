import { test, expect } from '@playwright/test';
import {LOGIN_URL} from './constants';

test.describe('Login Tests', () => {
  test('Login with valid user: Stina', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('input[name="username"]', 'stina');
    await page.fill('input[name="password"]', 'fåGelskådning');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Search for photos')).toBeVisible();
  });

  test('Login with valid user: Johan', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('input[name="username"]', 'johan');
    await page.fill('input[name="password"]', 'FotoGrafeRing1!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Search for photos')).toBeVisible();
  });

  test('Invalid login: wrong password', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('input[name="username"]', 'stina');
    await page.fill('input[name="password"]', 'wrongPassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid username or password')).toBeVisible();
  });

  test('Invalid login: unknown username', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('input[name="username"]', 'nonexistentuser');
    await page.fill('input[name="password"]', 'somePassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid username or password')).toBeVisible();
  });

  test('Invalid login: username filled, password empty (blocked by browser)', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('input[name="username"]', 'stina');
    const isDisabled = await page.locator('button[type="submit"]').isDisabled();
    await expect(isDisabled).toBe(false); // confirm it's clickable
    await page.click('button[type="submit"]');
    // Expect browser to prevent submission → assert field is focused
    await expect(page.locator('input[name="password"]')).toBeFocused();
  });

  test('Invalid login: password filled, username empty (blocked by browser)', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('input[name="password"]', 'fåGelskådning');
    await page.click('button[type="submit"]');
    await expect(page.locator('input[name="username"]')).toBeFocused();
  });

  test('Invalid login: both fields empty (blocked by browser)', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.click('button[type="submit"]');
    await expect(page.locator('input[name="username"]')).toBeFocused();
  });
});
