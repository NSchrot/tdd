import { test, expect } from '@playwright/test';

test.describe('Gestão de Multas (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@sistema.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Bem-vindo ao painel de controle da sua biblioteca.')).toBeVisible();

    await page.goto('/emprestimos');
    const cardEmprestimo = page.locator('.list-card').first();
    if (!(await cardEmprestimo.isVisible())) {
      await page.locator('.fab').click();
      await page.selectOption('select[name="livro_id"]', { index: 1 });
      await page.selectOption('select[name="usuario_id"]', { index: 1 });
      await page.fill('input[name="data_devolucao_prevista"]', '2027-12-31');
      await page.click('button[type="submit"]');
      await expect(page.locator('.alert--success')).toContainText('Empréstimo registrado com sucesso.');
      await page.locator('.alert--success button').click();
    }
  });

  test('deve navegar até a tela de multas e listar os registros', async ({ page }) => {
    await page.goto('/multas');
    await expect(page.locator('h2')).toContainText('Gestão de Multas');
  });

  test('deve fechar o modal de multa ao clicar no botão cancelar', async ({ page }) => {
    await page.goto('/multas');
    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('deve aplicar uma nova multa com sucesso', async ({ page }) => {
    await page.goto('/multas');
    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.selectOption('select[name="emprestimo_id"]', { index: 1 });
    await page.selectOption('select[name="tipo"]', 'Atraso');
    await page.fill('input[name="valor"]', '15.50');
    await page.fill('input[name="obs"]', 'Atraso de 3 dias no E2E');

    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Nova multa aplicada.');
  });

  test('deve permitir editar os detalhes de uma multa', async ({ page }) => {
    await page.goto('/multas');
    let cardMulta = page.locator('.list-card').first();
    if (!(await cardMulta.isVisible())) {
      await page.locator('.fab').click();
      await page.selectOption('select[name="emprestimo_id"]', { index: 1 });
      await page.selectOption('select[name="tipo"]', 'Dano');
      await page.fill('input[name="valor"]', '25.00');
      await page.fill('input[name="obs"]', 'Dano na capa');
      await page.click('button[type="submit"]');
      await expect(page.locator('.alert--success')).toContainText('Nova multa aplicada.');
      await page.locator('.alert--success button').click();
      cardMulta = page.locator('.list-card').first();
    }

    await cardMulta.locator('button:has-text("Editar")').click();
    await expect(page.locator('.modal-title')).toContainText('Editar Detalhes');

    await page.fill('input[name="valor"]', '30.00');
    await page.fill('input[name="obs"]', 'Dano na capa (atualizado pelo teste)');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Multa atualizada.');
  });

  test('deve permitir quitar uma multa pendente da listagem', async ({ page }) => {
    await page.goto('/multas');

    let cardPendente = page.locator('.list-card', { hasText: 'Pendente' }).first();
    if (!(await cardPendente.isVisible())) {
      await page.locator('.fab').click();
      await page.selectOption('select[name="emprestimo_id"]', { index: 1 });
      await page.selectOption('select[name="tipo"]', 'Extravio');
      await page.fill('input[name="valor"]', '50.00');
      await page.fill('input[name="obs"]', 'Extravio de livro');
      await page.click('button[type="submit"]');
      await expect(page.locator('.alert--success')).toContainText('Nova multa aplicada.');
      await page.locator('.alert--success button').click();
      cardPendente = page.locator('.list-card', { hasText: 'Pendente' }).first();
    }

    await cardPendente.locator('button:has-text("Quitar Multa")').click();
    await expect(page.locator('.modal')).toBeVisible();
    await page.click('button:has-text("Sim, confirmar")');

    await expect(page.locator('.alert--success')).toContainText('Multa quitada com sucesso.');
  });

  test('deve permitir excluir o registro de uma multa', async ({ page }) => {
    await page.goto('/multas');

    let cardMulta = page.locator('.list-card').first();
    if (!(await cardMulta.isVisible())) {
      await page.locator('.fab').click();
      await page.selectOption('select[name="emprestimo_id"]', { index: 1 });
      await page.selectOption('select[name="tipo"]', 'Outros');
      await page.fill('input[name="valor"]', '5.00');
      await page.fill('input[name="obs"]', 'Outros motivos');
      await page.click('button[type="submit"]');
      await expect(page.locator('.alert--success')).toContainText('Nova multa aplicada.');
      await page.locator('.alert--success button').click();
      cardMulta = page.locator('.list-card').first();
    }

    await cardMulta.locator('button.btn--danger').click();
    await expect(page.locator('.modal')).toBeVisible();
    await page.click('button:has-text("Sim, confirmar")');

    await expect(page.locator('.alert--success')).toContainText('Multa removida.');
  });
});
