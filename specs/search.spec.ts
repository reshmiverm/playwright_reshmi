import { test } from '@playwright/test';
import { AmazonHomePage } from '../page-class/HomePage';

test('Search Amazon products from CSV', async ({ page }) => {
  const amazonPage = new AmazonHomePage(page);
  await amazonPage.searchFromCsv('test-data/csvfile.csv');
});