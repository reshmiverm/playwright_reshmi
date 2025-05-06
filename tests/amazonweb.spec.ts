import { test, expect } from '@playwright/test';

test('amazon web', async ({ page }) => {
  await page.goto('https://www.amazon.in/'); //page navigation

});

test('get started link', async ({ page }) => {
  await page.goto('https://www.amazon.in/');  //page navigation
  await page.waitForTimeout(1000);

  await page.locator('input#twotabsearchtextbox').fill('shoes'); //  // Type 'shoes' into the search bar

  await page.waitForSelector('.s-suggestion'); // Wait for suggestions to load

  // list suggestion from the dropdown
  const suggestions = await page.locator('.s-suggestion');
    // Click the 2nd suggestion from the dropdown
  await suggestions.nth(1).click(); // Index is 0-based, so 1 is the second item

  // Step 4: Wait for product results to load
  const firstProduct = page.locator('[data-component-type="s-search-result"]').first();
  await firstProduct.scrollIntoViewIfNeeded();

  // Step 5: Extract first 3 product titles and prices
  const products = page.locator('[data-component-type="s-search-result"]');
  const results: { brand: string; title: string; price: string }[] = [];

  //loop that will run 3 times to fetch first 3 products...
  for (let i = 0; i < 3; i++) {
    const product = products.nth(i);

    try {

      // Wait for the brand to be available inside each product..
      const brand = await product.locator('span.a-size-base-plus.a-color-base').innerText({ timeout: 10000 });

      // Wait for the title to be available inside each product
      const title = await product.locator('h2.a-size-base-plus.a-spacing-none.a-color-base.a-text-normal').innerText({ timeout: 10000 });

      // Try to get price (fallback-safe)
      const priceWhole = await product.locator('.a-price-whole').first().innerText({ timeout: 5000 }).catch(() => 'N/A');
      const price = `₹${priceWhole}`;

     // get results,  push the brand, title and price into the results array 
      results.push({ brand, title, price });

   // log error if something fails (If something fails, print an error message along with which product had an issue)
   } 
   catch (error) {
      console.log(`Error fetching product ${i + 1}:`, error);
    }
  }

  // Print all collected results together...
  console.log('The list of first 3 Products:', results);

  await page.waitForTimeout(3000);
});
