const { Router } = require("express");
const db = require("../db");
const rutas = Router();

const jwt = require('jsonwebtoken');

rutas.get("/", async (_, res) => {
  const skaters = await db.listar();
  res.render("Dashboard", { skaters });
});

rutas.get("/skater-create", (_, res) => {
  res.render("registro");
});

rutas.get("/login", (_, res) => {
  res.render("login");
});

rutas.get("/admin", async (_, res) => {
  const skaters = await db.listar();
  res.render("Admin", { skaters });
});

rutas.get("/datos", async (req, res) => {
  const skaterId = req.query.skaterId
  const skaters = await db.buscar(skaterId);
  res.render("Datos", { skaters });
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

rutas.post("/login-inicio", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    /**
     * Usuario logueado.
     */
    const skater = await db.login(email,password);
    
    if (skater) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 120,
          data: skater,
        },
        secretKey
        );
      } else {
        res.send("Usuario o contraseña incorrecta");
      } 

    const template = skater.admin === true ? '/admin' : `/datos?skaterId=${skater.id}`
    res.redirect(template);
  } catch (err) {
    console.log({err})
  }
})

const secretKey = process.env["SECRET_KEY"]

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
