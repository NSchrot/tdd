let livros = [];
let proximoId = 1;

const criarLivro = (titulo, autor) => {
    const livro = { id: proximoId++, titulo, autor, disponivel: true };
    livros.push(livro);
    return livro;
};

const buscarLivroPorId = (id) => {
    return livros.find(l => l.id === id);
};

const atualizarLivro = (id, dados) => {
    const index = livros.findIndex(l => l.id === id);
    if (index === -1) return null;
    livros[index] = { ...livros[index], ...dados };
    return livros[index];
};

const deletarLivro = (id) => {
    const index = livros.findIndex(l => l.id === id);
    if (index === -1) return false;
    livros.splice(index, 1);
    return true;
};

const listarDisponiveis = () => {
    return livros.filter(l => l.disponivel === true);
};

const resetarLivros = () => {
    livros = [];
    proximoId = 1;
};

module.exports = { criarLivro, buscarLivroPorId, atualizarLivro, deletarLivro, listarDisponiveis, resetarLivros };
