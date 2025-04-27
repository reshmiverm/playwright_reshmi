import { test, expect } from '@playwright/test';

test('amazon web', async ({ page }) => {
  await page.goto('https://www.amazon.in/'); //page navigation

});

test('get started link', async ({ page }) => {
  await page.goto('https://www.amazon.in/');  //page navigation
  await page.waitForTimeout(1000);

  await page.locator('input#twotabsearchtextbox').fill('shoes'); //  // Type 'shoes' into the search bar

  await page.waitForSelector('.s-suggestion'); // Wait for suggestions to load

  // Click the 2nd suggestion from the dropdown
  const suggestions = await page.locator('.s-suggestion');
  await suggestions.nth(1).click(); // Index is 0-based, so 1 is the second item

  // Step 4: Wait for product results to load
  const firstProduct = page.locator('[data-component-type="s-search-result"]').first();
  await firstProduct.scrollIntoViewIfNeeded();

  // Step 5: Extract first 3 product titles and prices
  const products = page.locator('[data-component-type="s-search-result"]');

  // 🟡 Declare results array outside the loop
  const results: { title: string; price: string }[] = [];

  for (let i = 0; i < 3; i++) {
    const product = products.nth(i);

    try {
      const title = await product
        .locator('h2.a-size-base-plus.a-spacing-none.a-color-base.a-text-normal')
        .innerText({ timeout: 10000 });

      const priceWhole = await product
        .locator('.a-price-whole')
        .first()
        .innerText({ timeout: 5000 })
        .catch(() => 'N/A');

      const priceFraction = await product
        .locator('.a-price-fraction')
        .first()
        .innerText({ timeout: 5000 })
        .catch(() => '00');

      const price = `₹${priceWhole}${priceFraction}`;

      // ✅ Push to results array
      results.push({ title, price });

    } catch (error) {
      console.log(`Error processing product ${i + 1}:`, error);
    }
  }

  // ✅ Print all collected results together
  console.log('Top 3 Products:', results);

  await page.waitForTimeout(3000);
});