// page-class/HomePage.ts

import { Page, expect } from '@playwright/test';
import { readCsv } from '../utils/csvReader';

export class AmazonHomePage {
  constructor(private page: Page) {}

  async gotoHomePage() {
    await this.page.goto('https://www.amazon.in/');
  }

  async searchProduct(productName: string) {
    await this.page.locator('#twotabsearchtextbox').fill(productName);
    await this.page.locator('#nav-search-submit-button').click();
  }

  async isSearchResultVisible() {
  const firstResult = this.page.locator('[data-component-type="s-search-result"]').first();
  await firstResult.waitFor({ state: 'attached', timeout: 10000 }); // wait for up to 10s
  return firstResult.isVisible();
}

  async searchFromCsv(csvPath: string) {
    const testData = await readCsv(csvPath);

    // ✅ Print the full CSV data array
    console.log('Loaded test data from CSV:', testData);

    for (const data of testData) {
      console.log(`Searching for: ${data.product}`);
      await this.gotoHomePage();
      await this.searchProduct(data.product);

      const visible = await this.isSearchResultVisible();
      expect(visible).toBeTruthy();
    }
  }
}
