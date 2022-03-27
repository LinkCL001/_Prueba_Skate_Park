const { Router } = require("express");
const db = require("../src/models/db");

const router = Router();

// router.delete("/skaters/:id", (_, res) => {
//   db.eliminar(id)
//     .then(() => res.json({ message: "eliminado" }))
//     .catch((error) => res.json({ error }))
// })

module.exports = router;
