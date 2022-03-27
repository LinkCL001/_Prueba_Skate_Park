const { Router } = require("express");
const db = require("../src/models/db");
const rutas = Router();
const axios = require("axios");
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

const getCookies = (cookiesString) => {
  const cookies = cookiesString.split("; ").reduce((prev, current) => {
    const [name, ...value] = current.split("=");
    prev[name] = value.join("=");
    return prev;
  }, {});
  return cookies; //token en objeto ordenado
};

const validateToken = async (token) => {
  if (!token) {
    res.redirect("/login"); //usuario sin token redirect login
  }
  const user = await jwt.verify(token, secretKey); //si existe lo devuelve como dato
  return user;
};

const validateAdmin = async (req, res, next) => {
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  if (!token.data.admin) {//admin false redirect datos
    res.redirect("/datos");
  }
  next();
};

rutas.get("/admin", validateAdmin, async (req, res) => {
  axios
    .get("http://localhost:3000/skaters")
    .then((response) => {
      console.log(response.data);
      res.render("admin", { skaters: response.data });
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.get("/datos", async (req, res) => {
  const cookies = await getCookies(req.headers.cookie);
  const token = await validateToken(cookies.token);
  console.log(token);
  axios
    .get(`http://localhost:3000/skaters/${token.data.id}`)
    .then((response) => {
      console.log(response.data);
      res.render("datos", { skater: response.data });
    })
    .catch((e) => {
      console.log(e);
    });
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
  axios
    .post("http://localhost:3000/login", { email, password })
    .then(async (response) => {
      console.log(response);
      const user = await jwt.verify(response.data.token, secretKey);
      if (user.data.admin) {
        res.cookie("token", response.data.token);
        res.cookie("test", response.data.token);
        res.redirect("/Admin");
      } else {
        res.cookie("token", response.data.token);
        res.redirect("/datos");
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

rutas.post("/skater-delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(token);
  axios
    .get(`http://localhost:3000/skaters/${token.data.id}`)
    .then((response) => {
      console.log(response.data);
      res.render("datos", { skater: response.data });
    })
    .catch((e) => {
      console.log(e);
    });
  const skaters = await db.listar();
  res.render("Delete", { skaters });
});

rutas.post("/skater/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  switch (action) {
    case "editar":
      delete req.body.action;
      try {
        await db.update(id, req.body).then(() => res.redirect("/"));
      } catch (e) {
        res.render("error", { title: "Error al editar usuario", message: e });
      }
      break;
    case "eliminar":
      axios
        .delete(`http://localhost:3000/skaters/${id}`)
        .then((response) => {
          console.log(response);
          let message = 'No se pudo eliminar el Skater';
          if (response.data.skaterDelete.rowCount > 0) {
            message = 'Usuario Eliminado'
          }

          res.render("Dashboard", { skaters: response.data.skaters, message })
        })
        .catch((e) => {
          console.log(e);
        });
      break;
    case "updateStatus":
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
