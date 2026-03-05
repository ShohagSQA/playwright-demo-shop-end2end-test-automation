import { test, expect } from '@playwright/test';

test('End-to-end user registration and purchase flow', async ({ page }) => {
  // Generate a unique email to avoid "Already Registered" errors
  const uniqueEmail = `sonita${Date.now()}@yahoo.com`;

  await page.goto('https://demowebshop.tricentis.com/');

  // --- Registration ---
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('radio', { name: 'Female' }).check();
  await page.getByRole('textbox', { name: 'First name:' }).fill('Sonita');
  await page.getByRole('textbox', { name: 'Last name:' }).fill('Raya');
  await page.getByRole('textbox', { name: 'Email:' }).fill(uniqueEmail);
  await page.getByRole('textbox', { name: 'Password:', exact: true }).fill('sonita100#');
  await page.getByRole('textbox', { name: 'Confirm password:' }).fill('sonita100#');
  await page.getByRole('button', { name: 'Register' }).click();

  // Verify registration success
  await expect(page.getByText('Your registration completed')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

  // --- Product Selection: Desktop ---
  await page.getByRole('link', { name: 'Computers' }).first().click();
  await page.getByRole('link', { name: 'Desktops' }).first().click();
  
  // Sorting and Page Size (using values instead of full URLs for stability)
  await page.locator('#products-orderby').selectOption({ label: 'Price: High to Low' });
  await page.locator('#products-pagesize').selectOption({ label: '12' });

  await page.getByRole('link', { name: 'Build your own expensive computer', exact: true }).click();
  await page.locator('#add-to-cart-button-74').click();

  // --- Product Selection: Digital Download ---
  await page.getByRole('link', { name: 'Digital downloads' }).first().click();
  await page.getByRole('link', { name: '3rd Album', exact: true }).click();
  await page.getByRole('textbox', { name: 'Qty:' }).fill('2');
  await page.locator('#add-to-cart-button-53').click();

  // --- Checkout Process ---
  await page.getByRole('link', { name: 'Shopping cart' }).first().click();
  await page.locator('#termsofservice').check();
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Address Details (Selects by label/text for clarity)
  await page.getByLabel('Country:').selectOption({ label: 'United States' });
  await page.getByLabel('State / province:').selectOption({ label: 'Alabama' });
  await page.getByRole('textbox', { name: 'City:' }).fill('Testcity');
  await page.getByRole('textbox', { name: 'Address 1:' }).fill('123 Test Street');
  await page.getByRole('textbox', { name: 'Zip / postal code:' }).fill('35004');
  await page.getByRole('textbox', { name: 'Phone number:' }).fill('2355356355');
  
  // Billing Address Continue
  await page.getByRole('button', { name: 'Continue' }).first().click();
  
  // Shipping Address Continue (If applicable)
  await page.locator('#shipping-buttons-container').getByRole('button', { name: 'Continue' }).click();
  
  // Shipping Method
  await page.locator('#shipping-method-buttons-container').getByRole('button', { name: 'Continue' }).click();
  
  // Payment Method
  await page.locator('#payment-method-buttons-container').getByRole('button', { name: 'Continue' }).click();
  
  // Payment Info
  await page.locator('#payment-info-buttons-container').getByRole('button', { name: 'Continue' }).click();

  // Final Confirmation
  await page.getByRole('button', { name: 'Confirm' }).click();

  // --- Final Assertions ---
  await expect(page.getByText('Your order has been successfully processed!')).toBeVisible();
  await expect(page.getByText('Order number:')).toBeVisible();

  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Log out' }).click();
});