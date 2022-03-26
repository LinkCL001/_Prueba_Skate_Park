const { Router } = require("express");
const db = require("../src/models/db");
const rutas = Router();
const axios = require('axios');
const secretKey = process.env["SECRET_KEY"];
const jwt = require("jsonwebtoken");
const { response } = require("express");

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

rutas.get("/admin", async (req, res) => {
  const cookies = (req.headers.cookie).split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});
  if (!cookies.token) {
    res.redirect('/login')
  }
  const user = await jwt.verify(cookies.token, secretKey)
  if (!user.data.admin) {
    res.redirect('/datos')
  }
  console.log(cookies.token);
  // const skaters = await db.listar();
  // res.render("Admin", { skaters });
});

rutas.get("/datos", async (req, res) => {
  const skaterId = req.query.skaterId;
  const skaters = await db.buscar(skaterId);
  res.render("Datos", { skaters });
});

rutas.post("/skater-create", (req, res) => {
  const { fotos } = req.files;
  fotos.mv(`${__dirname}/public/imgs/${fotos.name}`, (e) => {
    console.log(e);
  });
  req.body.foto = fotos.name;
  req.body.estado = false;
  db.ingresar(req.body)
    .then(() => res.redirect("/"))
    .catch((e) =>
      res.render("error", { title: "Error al crear skater", message: e })
    );
});

rutas.post("/login-inicio", async (req, res) => {
  const { email, password } = req.body;
  axios.post('http://localhost:3000/login', { email, password }).then(async response => {
    console.log(response);
    const user = await jwt.verify(response.data.token, secretKey)
    if (user.data.admin) {
      res.cookie('token', response.data.token)
      res.cookie('test', response.data.token)
      res.redirect("/Admin")
    } else {
      res.cookie('token', response.data.token)
      res.redirect("/datos")
    }
  }
  ).catch((e) => {
    console.log(e)
  })

  // try {
  //   const { email, password } = req.body;
  //   const skater = await db.login(email, password);

  //   if (skater) {
  //     const token = jwt.sign(
  //       {
  //         exp: Math.floor(Date.now() / 1000) + 120,
  //         data: skater,
  //       },
  //       secretKey
  //     );
  //   } else {
  //     res.send("Usuario o contraseña incorrecta");
  //   }

  //   const template =
  //     skater.admin === true ? "/admin" : `/datos?skaterId=${skater.id}`;
  //   res.redirect(template,{token});
  // } catch (err) {
  //   console.log({ err });
  // }
});



rutas.get("/skater-delete", async (_, res) => {
  const skaters = await db.listar();
  res.render("Delete", { skaters });
});

rutas.post("/skater/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  switch(action) {
    case 'editar':
      delete req.body.action;
      try {
        await db.update(id, req.body).then(() => res.redirect("/"));
      } catch (e) {
        res.render("error", { title: "Error al editar usuario", message: e });
      }
      break;
    case 'eliminar':
      try {
        await db.eliminar(id).then(() => res.redirect("/"));
      } catch (e) {
        res.render("error", { title: "Error al eliminar usuario", message: e });
      }
      break;
    case 'updateStatus':
      const { estado } = req.body;
      try {
        await db.updateStatus(id, !!estado).then(() => res.redirect("/Admin"));
      } catch (e) {
        res.render("error", { title: "Error al editar usuario", message: e });
      }
      break;
    default:
      break;
   }
});

rutas.put("/update-estado/:id", async (req, res) => {
  const { id } = req.params;
  const estado = Object.values(req.body);
  const result = await updateStatus(estado, id);
  result > 0
    ? res.status(200).send(true)
    : console.log("Error al editar Estado");
});

module.exports = rutas;
