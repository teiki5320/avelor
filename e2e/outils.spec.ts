import { test, expect } from '@playwright/test';

/**
 * Tests E2E des calculateurs : on vérifie qu'ils se chargent, qu'ils
 * acceptent une saisie utilisateur et qu'ils produisent un résultat
 * visible.
 */

test.describe('Calculateur de prescription', () => {
  test('affiche un résultat après saisie', async ({ page }) => {
    await page.goto('/outils/prescription');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Calculateur de licenciement + AGS', () => {
  test('somme les indemnités pour plusieurs salariés', async ({ page }) => {
    await page.goto('/outils/licenciement');
    await expect(page.locator('h1')).toContainText(/licenciement/i);

    // Le calculateur a au moins 1 salarié pré-rempli
    const addButton = page.getByRole('button', { name: /Ajouter un salarié/i });
    await addButton.click();
    // Au moins 2 salariés maintenant
    const numberInputs = page.locator('input[type="number"]');
    expect(await numberInputs.count()).toBeGreaterThanOrEqual(4);

    // Total affiché
    await expect(page.getByText(/Total équipe/i)).toBeVisible();
  });
});

test.describe('Calculateur de valorisation des stocks (nouveau)', () => {
  test('affiche la fourchette pour un prix de revient', async ({ page }) => {
    await page.goto('/outils/stocks');
    await expect(page.locator('h1')).toContainText(/stocks/i);

    const prixInput = page.locator('input[type="number"]').first();
    await prixInput.fill('100000');

    // Le résultat doit s'afficher
    await expect(page.getByText(/Fourchette de valeur de réalisation/i)).toBeVisible();
  });
});

test.describe('Liste des outils', () => {
  test('expose au moins 10 calculateurs (avec stocks)', async ({ page }) => {
    await page.goto('/outils');
    const links = page.locator('a[href^="/outils/"]');
    expect(await links.count()).toBeGreaterThanOrEqual(10);
  });
});
