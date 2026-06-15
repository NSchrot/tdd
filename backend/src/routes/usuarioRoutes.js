const { Router } = require("express");
const { listar, buscarPorId, criar, login, atualizar, deletar } = require("../controllers/usuarioController");

const router = Router();

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.post("/login", login);
router.put("/:id", atualizar);
router.delete("/:id", deletar);

module.exports = router;
