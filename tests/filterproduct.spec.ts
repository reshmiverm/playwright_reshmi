import { test, expect } from '@playwright/test';


test('Apply filter and verify filtered products match Amazon Pay', async ({ page }) => {
  // 1. Go to Amazon.in
  await page.goto('https://www.amazon.in/');

  // 2. Click on 'Gift Cards' link from top navigation
  await page.getByRole('link', { name: 'Gift Cards' }).click();

  // 3. Wait for Gift Cards page to load
  await page.waitForLoadState('domcontentloaded');

  // 4. Click on the 'brand' filter
  const amazonPayFilter = page.locator('span.a-size-base.a-color-base:has-text("Ceat")');
  await amazonPayFilter.click();

  // 5. Wait for results to load
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000); // small wait for results to visually load

 // Locate the H2 span inside each product box
const productTitleLocator = page.locator('h2.a-size-base-plus.a-spacing-none.a-color-base.a-text-normal span');

// Wait for first visible title
await expect(productTitleLocator.first()).toBeVisible({ timeout: 10000 });

// Extract all titles
const productTitles = await productTitleLocator.allTextContents();
//console.log(productTitles);

// Assert titles are found
expect(productTitles.length).toBeGreaterThan(0);

// Optionally, validate each title
const expectedKeyword = 'ceat';

for (const title of productTitles) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes(expectedKeyword)) {
    console.log(`Matched: ${title}`);
  } else {
    console.log(`Not matched: ${title}`);
  }

  // Still assert for test validity
  expect(lowerTitle).toContain(expectedKeyword);
}
});