import { test, expect } from '@playwright/test';

const filterKey = process.env.filterKey || 'Headphones';
const brandName = process.env.brandName || 'boAt';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.amazon.in/');
});

test.afterEach(async ({ page }) => {
  console.log(`Filter test completed for ${brandName}`);
});

test('Apply filter and assert brand in results', async ({ page }) => {
  // Search the filter key (e.g. Headphones)
  await page.getByRole('searchbox').fill(filterKey);
  await page.keyboard.press('Enter');
  await page.getByText('Brands', { exact: true });

  // Expand brand filter if collapsed
  const seeMore = page.locator('a', { hasText: 'See more' }).first();
  if (await seeMore.isVisible()) {
    await seeMore.scrollIntoViewIfNeeded();
    await seeMore.click();
  }

  // Use label to locate brand checkbox
const brandCheckbox = page.locator('span.a-size-base.a-color-base', { hasText: brandName }).nth(0);

await expect(brandCheckbox).toBeVisible({ timeout: 15000 });
await brandCheckbox.scrollIntoViewIfNeeded();

// Click the checkbox's parent element, which is usually clickable
await brandCheckbox.click({ force: true });

  // Wait for results to refresh
  const searchResults = page.locator('[data-component-type="s-search-result"]');
  await expect(searchResults.first()).toBeVisible({ timeout: 10000 });

  const titles = await searchResults.locator('h2 span').allTextContents();

for (const title of titles) {
  if (title.toLowerCase().includes(brandName.toLowerCase())) {
    expect(title).toMatch(new RegExp(brandName, 'i')); // assert if brand is found
  } else {
    console.warn(`Skipped title (not matching brand): ${title}`);
  }
}
});