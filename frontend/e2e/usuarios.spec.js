import { test, expect } from '@playwright/test';

test.describe('Gestão de Usuários (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.fill('input[type="email"]', 'admin@sistema.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Bem-vindo ao painel de controle da sua biblioteca.')).toBeVisible();
  });

  test('deve navegar até a tela de usuários e listar os registros', async ({ page }) => {
    await page.goto('/usuarios');
    await expect(page.locator('h2')).toContainText('Gestão de Usuários');
  });

  test('deve fechar o modal de cadastro de usuário ao clicar no botão cancelar', async ({ page }) => {
    await page.goto('/usuarios');
    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('deve permitir adicionar um novo usuário e encontrá-lo na lista', async ({ page }) => {
    const nomeAleatorio = `Usuario E2E ${Math.floor(Math.random() * 10000)}`;
    const emailAleatorio = `e2e_${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto('/usuarios');
    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.fill('input[name="nome"]', nomeAleatorio);
    await page.fill('input[name="email"]', emailAleatorio);
    await page.fill('input[name="senha"]', 'senha123');
    await page.selectOption('select[name="tipo"]', 'aluno');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Usuário cadastrado com sucesso.');

    let encontrado = false;
    for (let i = 0; i < 20; i++) {
      await expect(page.locator('.list-cards')).toBeVisible({ timeout: 5000 });

      if (await page.getByText(nomeAleatorio).isVisible()) {
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

  test('deve permitir editar um usuário cadastrado', async ({ page }) => {
    const nomeOriginal = `EditMe E2E ${Math.floor(Math.random() * 10000)}`;
    const emailOriginal = `edit_e2e_${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto('/usuarios');
    await page.locator('.fab').click();
    await page.fill('input[name="nome"]', nomeOriginal);
    await page.fill('input[name="email"]', emailOriginal);
    await page.fill('input[name="senha"]', 'senha123');
    await page.selectOption('select[name="tipo"]', 'aluno');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Usuário cadastrado com sucesso.');
    await page.locator('.alert--success button').click();

    let cardUsuario = null;
    for (let i = 0; i < 20; i++) {
      const card = page.locator('.list-card', { hasText: nomeOriginal });
      if (await card.isVisible()) {
        cardUsuario = card;
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

    expect(cardUsuario).not.toBeNull();

    await cardUsuario.locator('button:has-text("Editar")').click();
    await expect(page.locator('.modal-title')).toContainText('Editar Usuário');

    const novoNome = nomeOriginal + " (Editado)";
    await page.fill('input[name="nome"]', novoNome);
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Usuário atualizado com sucesso.');
  });

  test('deve impedir a exclusão da própria conta logada', async ({ page }) => {
    await page.goto('/usuarios');

    let cardAdmin = null;
    for (let i = 0; i < 20; i++) {
      const card = page.locator('.list-card', { hasText: 'admin@sistema.com' });
      if (await card.isVisible()) {
        cardAdmin = card;
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

    expect(cardAdmin).not.toBeNull();

    await cardAdmin.locator('button.btn--danger').click();

    await expect(page.locator('.alert--error')).toContainText('Você não pode excluir sua própria conta.');
  });

  test('deve permitir excluir um usuário cadastrado', async ({ page }) => {
    const nomeExcluir = `DeleteMe E2E ${Math.floor(Math.random() * 10000)}`;
    const emailExcluir = `delete_e2e_${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto('/usuarios');
    await page.locator('.fab').click();
    await page.fill('input[name="nome"]', nomeExcluir);
    await page.fill('input[name="email"]', emailExcluir);
    await page.fill('input[name="senha"]', 'senha123');
    await page.selectOption('select[name="tipo"]', 'aluno');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.alert--success')).toContainText('Usuário cadastrado com sucesso.');
    await page.locator('.alert--success button').click();

    let cardUsuario = null;
    for (let i = 0; i < 20; i++) {
      const card = page.locator('.list-card', { hasText: nomeExcluir });
      if (await card.isVisible()) {
        cardUsuario = card;
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

    expect(cardUsuario).not.toBeNull();

    await cardUsuario.locator('button.btn--danger').click();

    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal p.text-muted')).toContainText(`Deseja realmente remover o usuário "${nomeExcluir}"?`);

    await page.click('button:has-text("Confirmar")');

    await expect(page.locator('.alert--success')).toContainText('Usuário removido.');
  });
});
