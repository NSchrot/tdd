const { Router } = require("express");
const { criar, buscarPorId, atualizar, deletar, disponiveis } = require("../controllers/livroController");

const router = Router();

router.get("/disponiveis", disponiveis);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", deletar);

module.exports = router;