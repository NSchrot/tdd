import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Livros (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.fill('input[type="email"]', 'admin@sistema.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Bem-vindo ao painel de controle da sua biblioteca.')).toBeVisible();
  });

  test('deve navegar até a tela de livros e listar o acervo', async ({ page }) => {
    await page.goto('/livros');
    await expect(page.locator('h2')).toContainText('Acervo de Livros');
  });

  test('deve permitir adicionar um novo livro e encontrá-lo na lista', async ({ page }) => {
    const tituloAleatorio = `Livro E2E ${Math.floor(Math.random() * 1000)}`;

    await page.goto('/livros');
    await page.locator('.fab').click();
    await page.fill('input[name="titulo"]', tituloAleatorio);
    await page.fill('input[name="autor"]', 'Automação Playwright');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();

    let encontrado = false;
    for (let i = 0; i < 20; i++) {
      await expect(page.locator('.list-cards')).toBeVisible({ timeout: 5000 });

      if (await page.getByText(tituloAleatorio).isVisible()) {
        encontrado = true;
        break;
      }

      const btnProx = page.locator('button').filter({ has: page.locator('svg.lucide-chevron-right') });
      if (await btnProx.isVisible() && !(await btnProx.isDisabled())) {
        await btnProx.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }

    expect(encontrado).toBeTruthy();
  });

  test('deve fechar o modal ao clicar no botão cancelar', async ({ page }) => {
    await page.goto('/livros');

    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('deve permitir editar um livro cadastrado', async ({ page }) => {
    const sufixo = Math.floor(Math.random() * 10000);
    const tituloOriginal = `EditLivro E2E ${sufixo}`;
    const tituloEditado = `${tituloOriginal} Atualizado`;

    await page.goto('/livros');
    await page.locator('.fab').click();
    await page.fill('input[name="titulo"]', tituloOriginal);
    await page.fill('input[name="autor"]', 'Autor Original');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();

    const cardLivro = page.locator('.list-card', { hasText: tituloOriginal }).first();
    await expect(cardLivro).toBeVisible();

    await cardLivro.locator('button:has-text("Editar")').click();
    await expect(page.locator('.modal-title')).toContainText('Editar Livro');

    await page.fill('input[name="titulo"]', tituloEditado);
    await page.fill('input[name="autor"]', 'Autor Atualizado');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.list-card', { hasText: tituloEditado })).toBeVisible();
    await expect(page.locator('.list-card', { hasText: 'Autor Atualizado' })).toBeVisible();
  });

  test('deve permitir excluir um livro cadastrado', async ({ page }) => {
    const tituloExcluir = `DeleteLivro E2E ${Math.floor(Math.random() * 10000)}`;

    await page.goto('/livros');
    await page.locator('.fab').click();
    await page.fill('input[name="titulo"]', tituloExcluir);
    await page.fill('input[name="autor"]', 'Autor Para Excluir');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();

    const cardLivro = page.locator('.list-card', { hasText: tituloExcluir }).first();
    await expect(cardLivro).toBeVisible();

    await cardLivro.locator('button:has-text("Excluir")').click();
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal p.text-muted')).toContainText(`Deseja realmente excluir o livro "${tituloExcluir}"?`);

    await page.locator('.modal button.btn--danger').click();

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.list-card', { hasText: tituloExcluir })).not.toBeVisible();
  });
});
