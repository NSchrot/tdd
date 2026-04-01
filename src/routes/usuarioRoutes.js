const { Router } = require("express");
const { listar, buscarPorId, criar, atualizar, deletar } = require("../controllers/usuarioController");

const router = Router();

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", deletar);

module.exports = router;
