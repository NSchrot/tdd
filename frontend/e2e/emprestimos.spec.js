import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Empréstimos (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.fill('input[type="email"]', 'admin@sistema.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Bem-vindo ao painel de controle da sua biblioteca.')).toBeVisible();
  });

  test('deve navegar até a tela de empréstimos e listar os registros', async ({ page }) => {
    await page.goto('/emprestimos');
    await expect(page.locator('h2')).toContainText('Empréstimos');
  });

  test('deve fechar o modal de empréstimo ao clicar no botão cancelar', async ({ page }) => {
    await page.goto('/emprestimos');
    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('deve registrar um novo empréstimo com sucesso', async ({ page }) => {
    await page.goto('/emprestimos');
    await page.locator('.fab').click();

    await page.selectOption('select[name="livro_id"]', { index: 1 });
    await page.selectOption('select[name="usuario_id"]', { index: 1 });
    await page.fill('input[name="data_devolucao_prevista"]', '2027-12-31');

    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Empréstimo registrado com sucesso.');
  });

  test('deve permitir editar a data de devolução prevista de um empréstimo ativo', async ({ page }) => {
    await page.goto('/emprestimos');

    const cardAtivo = page.locator('.list-card', { hasText: 'Ativo' }).first();

    if (!(await cardAtivo.isVisible())) {
      await page.locator('.fab').click();
      await page.selectOption('select[name="livro_id"]', { index: 1 });
      await page.selectOption('select[name="usuario_id"]', { index: 1 });
      await page.fill('input[name="data_devolucao_prevista"]', '2027-12-31');
      await page.click('button[type="submit"]');
      await expect(page.locator('.alert--success')).toContainText('Empréstimo registrado com sucesso.');
      await page.locator('.alert--success button').click();
    }

    const btnEditar = cardAtivo.locator('button.btn--secondary');
    await btnEditar.click();

    await expect(page.locator('.modal-title')).toContainText('Editar Empréstimo');

    await page.fill('input[name="data_devolucao_prevista"]', '2028-06-15');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Empréstimo atualizado com sucesso.');
  });

  test('deve permitir registrar a devolução (concluir) de um empréstimo ativo', async ({ page }) => {
    await page.goto('/emprestimos');

    let cardAtivo = page.locator('.list-card', { hasText: 'Ativo' }).first();
    if (!(await cardAtivo.isVisible())) {
      await page.locator('.fab').click();
      await page.selectOption('select[name="livro_id"]', { index: 1 });
      await page.selectOption('select[name="usuario_id"]', { index: 1 });
      await page.fill('input[name="data_devolucao_prevista"]', '2027-12-31');
      await page.click('button[type="submit"]');
      await expect(page.locator('.alert--success')).toContainText('Empréstimo registrado com sucesso.');
      await page.locator('.alert--success button').click();
    }

    await cardAtivo.locator('button:has-text("Devolver")').click();

    await expect(page.locator('.modal')).toBeVisible();
    await page.locator('.modal button.btn--success').click();

    await expect(page.locator('.alert--success')).toContainText('Devolução concluída.');
  });

  test('deve permitir excluir o histórico de um empréstimo concluído', async ({ page }) => {
    await page.goto('/emprestimos');

    let cardConcluido = page.locator('.list-card', { hasText: 'Concluído' }).first();
    if (!(await cardConcluido.isVisible())) {
      await page.locator('.fab').click();
      await page.selectOption('select[name="livro_id"]', { index: 1 });
      await page.selectOption('select[name="usuario_id"]', { index: 1 });
      await page.fill('input[name="data_devolucao_prevista"]', '2027-12-31');
      await page.click('button[type="submit"]');
      await expect(page.locator('.alert--success')).toContainText('Empréstimo registrado com sucesso.');
      await page.locator('.alert--success button').click();

      const card = page.locator('.list-card', { hasText: 'Ativo' }).first();
      await card.locator('button:has-text("Devolver")').click();
      await page.locator('.modal button.btn--success').click();
      await expect(page.locator('.alert--success')).toContainText('Devolução concluída.');
      await page.locator('.alert--success button').click();
    }

    await cardConcluido.locator('button:has-text("Excluir Histórico")').click();

    await expect(page.locator('.modal')).toBeVisible();
    await page.locator('.modal button.btn--danger').click();

    await expect(page.locator('.alert--success')).toContainText('Empréstimo excluído.');
  });
});
