const app = require('./app');
const { sequelize, Usuario, Livro } = require('./models');
const PORT = process.env.PORT || 3000;
let server;

async function seedBaseData() {
    await Usuario.findOrCreate({
        where: { email: 'admin@sistema.com' },
        defaults: {
            nome: 'Administrador (Teste)',
            senha: '123456',
            tipo: 'admin',
        },
    });

    await Livro.findOrCreate({
        where: { titulo: 'Dom Casmurro' },
        defaults: { autor: 'Machado de Assis', disponivel: true },
    });

    await Livro.findOrCreate({
        where: { titulo: 'O Alquimista' },
        defaults: { autor: 'Paulo Coelho', disponivel: true },
    });
}

sequelize.sync().then(async () => {
    await seedBaseData();
    server = app.listen(PORT, () => {
        console.log("Server rodando na porta " + PORT);
    });
}).catch((err) => {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
});
