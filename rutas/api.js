const { Router } = require("express");
const db = require("../db");

const router = Router();

router.post("/skaters", (req, res) => {
  db.ingresar(req.body)
    .then(() => res.json({ message: "creado" }))
    .catch((error) => res.json({ error }));
});

router.get("/skaters", (_, res) => {
  db.listar()
    .then((skaters) => res.json(skaters))
    .catch((error) => res.json({ error }));
});


// router.delete("/skaters/:id", (_, res) => {
//   db.eliminar(id)
//     .then(() => res.json({ message: "eliminado" }))
//     .catch((error) => res.json({ error }));
// });

module.exports = router;
