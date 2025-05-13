import { test, expect, Locator, Page } from '@playwright/test';

let SearchInput: Locator;

const staticSearchData = [
  { keyword: 'Air conditioners', count: 3 },
  { keyword: 'Refrigerators', count: 2 },
  { keyword: 'Bluetooth headphones', count: 4 },
  { keyword: 'Helmets', count: 3 },
];

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.amazon.in/');
});

test.afterEach(async ({ page }) => {
  console.log('Search completed. Resetting browser...');
  await page.goto('https://www.amazon.in/');
});

async function searchProduct(page: Page, productName: string) {
  SearchInput = page.locator('#nav-search').getByPlaceholder('Search Amazon.in');
  await SearchInput.click();
  await SearchInput.fill(productName);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
}

async function getProducts(page: Page, count: number) {
  const searchResults = page.locator('[data-component-type="s-search-result"]');
  await searchResults.first().waitFor({ state: 'visible' });

  const results = [];

  for (let i = 0; i < count; i++) {
    const item = searchResults.nth(i);
    const title = await item.locator('h2').textContent();
    const price = await item.locator('.a-price .a-price-whole').first().textContent();
    results.push({ title: title?.trim(), price: price?.trim() });
  }

  return results;
}

test('Search static test data and extract products', async ({ page }) => {
  for (const { keyword, count } of staticSearchData) {
    await searchProduct(page, keyword);
    const products = await getProducts(page, count);
    console.log(`\nSearch: ${keyword}`);
    console.table(products);
  }
});