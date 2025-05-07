import { test, expect } from '@playwright/test';
import fetch from 'node-fetch';
import type {ImageResponse} from "./constants";
import {BASE_URL, IMAGE_API_URL} from "./constants";


let keywords: string[] = [];

test.beforeAll(async () => {
    const res = await fetch(IMAGE_API_URL);
    if (!res.ok) throw new Error(`Failed to fetch images: ${res.status}`);

    const data = (await res.json()) as ImageResponse;
    const images = data.results;

    keywords = images
        .flatMap((img) => (img.description ?? '').split(/\s+/).map((w) => w.toLowerCase()))
        .filter((word) => word.length > 2);

    keywords = [...new Set(keywords)];
});

test.describe('Image Search Tests', () => {
    test('Search for a real keyword from API', async ({ page }) => {
        const keyword = keywords[0] ?? 'cat';

        await page.goto(BASE_URL);
        await page.fill('input[name="search_terms"]', keyword);
        await page.click('button[type="submit"]');

        await expect(page.locator('#searchResultsContainer')).toBeVisible();
        const imageCount = await page.locator('#searchResults img').count();
        expect(imageCount).toBeGreaterThan(0);
    });

    test('Search is case insensitive', async ({ page }) => {
        const keyword = keywords[1]?.toUpperCase() ?? 'FLOWERS';

        await page.goto(BASE_URL);
        await page.fill('input[name="search_terms"]', keyword);
        await page.click('button[type="submit"]');

        await expect(page.locator('#searchResultsContainer')).toBeVisible();
        const imageCount = await page.locator('#searchResults img').count();
        expect(imageCount).toBeGreaterThan(0);
    });

    test('Invalid keyword returns no results', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('input[name="search_terms"]', 'invalidsearch123456');
        await page.click('button[type="submit"]');

        await expect(page.locator('#message-no-search-results')).toBeVisible();
    });

    test('Empty search input does not crash', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('input[name="search_terms"]', '');
        await page.click('button[type="submit"]');

        await expect(page.locator('input[name="search_terms"]')).toBeVisible();
    });
});
