const { Router } = require("express");
const db = require("../db");
const users = require('../data/admin').results;
const rutas = Router();

const jwt = require('jsonwebtoken');

rutas.get("/", async (_, res) => {
  const skaters = await db.listar();
  console.log(skaters);
  res.render("Dashboard", {skaters});
});

rutas.get("/skater-create", (_, res) => {
  res.render("registro");
});

rutas.get("/login-inicio", (_, res) => {
  res.render("login");
});

rutas.post("/skater-create", (req, res) => {
  const { fotos } = req.files;
  fotos.mv(`${__dirname}/public/imgs/${fotos.name}`, (err) => {
    console.log(err);
  });
  req.body.foto = fotos.name;
  req.body.estado = false;
  db.ingresar(req.body)
    .then(() => res.redirect("/"))
    .catch((err) =>
      res.render("error", { title: "Error al crear skater", message: err })
    );
});


rutas.get('/login-inicio', (req, res) => {
  const { email, password } = req.query;
  const admin = users.find((u) => u.email == email && u.password == password);
  if(admin) {
      const token = jwt.sign(
      {
      exp: Math.floor(Date.now()/ 1000) + 120,
      data: admin,
      },
      );
      res.render("Admin", {})
   } else {
       res.send('Usuario o contraseña incorrecta')
   }
})

// rutas.get("/skater-delete/:id", async (req, res) => {
//   const { id } = req.params
//   const { confirmado } = req.query
//   try {
//     if (confirmado)
//       await db.eliminar(id).then(() => res.redirect("/"))
//     else
//       res.render("admin", { user: await db.buscar(id) })
//   } catch (err) {
//     res.render("error", { title: "Error al confirmar el skater", message: err })
//   }
// })

module.exports = rutas;
