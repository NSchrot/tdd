const request = require('supertest');
const app = require('../src/app');
const { resetarLivros } = require('../src/services/livroService');

beforeEach(() => {
    resetarLivros();
});

describe('POST /livros', () => {
    test('cria um livro com titulo e autor', async () => {
        const res = await request(app)
            .post('/livros')
            .send({ titulo: 'Clean Code', autor: 'Robert Martin' });

        expect(res.status).toBe(201);
        expect(res.body.titulo).toBe('Clean Code');
        expect(res.body.autor).toBe('Robert Martin');
        expect(res.body).toHaveProperty('id');
        expect(res.body.disponivel).toBe(true);
    });

    test('retorna 400 sem titulo ou autor', async () => {
        const res = await request(app)
            .post('/livros')
            .send({ titulo: 'Clean Code' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

describe('GET /livros/:id', () => {
    test('retorna livro existente por ID', async () => {
        const criado = await request(app)
            .post('/livros')
            .send({ titulo: 'Clean Code', autor: 'Robert Martin' });

        const res = await request(app).get(`/livros/${criado.body.id}`);

        expect(res.status).toBe(200);
        expect(res.body.titulo).toBe('Clean Code');
    });

    test('retorna 404 para ID inexistente', async () => {
        const res = await request(app).get('/livros/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
    });
});

describe('PUT /livros/:id', () => {
    test('atualiza livro existente', async () => {
        const criado = await request(app)
            .post('/livros')
            .send({ titulo: 'Clean Code', autor: 'Robert Martin' });

        const res = await request(app)
            .put(`/livros/${criado.body.id}`)
            .send({ titulo: 'Clean Architecture' });

        expect(res.status).toBe(200);
        expect(res.body.titulo).toBe('Clean Architecture');
        expect(res.body.autor).toBe('Robert Martin');
    });

    test('retorna 404 para ID inexistente', async () => {
        const res = await request(app)
            .put('/livros/999')
            .send({ titulo: 'Novo Titulo' });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
    });
});

describe('DELETE /livros/:id', () => {
    test('deleta livro existente', async () => {
        const criado = await request(app)
            .post('/livros')
            .send({ titulo: 'Clean Code', autor: 'Robert Martin' });

        const res = await request(app).delete(`/livros/${criado.body.id}`);

        expect(res.status).toBe(204);
    });

    test('retorna 404 para ID inexistente', async () => {
        const res = await request(app).delete('/livros/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
    });
});

describe('GET /livros/disponiveis', () => {
    test('retorna apenas livros disponiveis', async () => {
        await request(app)
            .post('/livros')
            .send({ titulo: 'Clean Code', autor: 'Robert Martin' });

        await request(app)
            .post('/livros')
            .send({ titulo: 'Refactoring', autor: 'Martin Fowler' });

        const res = await request(app).get('/livros/disponiveis');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
        res.body.forEach(livro => {
            expect(livro.disponivel).toBe(true);
        });
    });
});