const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const front = require("./rutas/front");
const api = require("./rutas/api");
const expressFileUpload = require('express-fileupload');

const port = process.env.PORT || 3000
const app = express()

app.listen(port, () => {
  console.log(`El servidor está inicializando en el puerto ${port}`)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine", "handlebars");

//app.use("/", express.static(__dirname + "/rutas/public/css"));

// app.set("views", "./views")

app.use(
  "/imgs", express.static(__dirname + "/rutas/public/imgs")
);
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist/css")
);
app.use(
  "/jquery", express.static(__dirname + "/node_modules/jquery/dist")
);
app.use(
  "/bootstrapJS",
  express.static(__dirname + "/node_modules/bootstrap/dist/js")
);

app.use(expressFileUpload({
  limits: { fileSize: 5000000 },
  abortOnLimit: true,
  responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
  })
);

app.engine(
  "handlebars",
  exphbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/component/",
    helpers: {
      mensajeBienvenida: () => `Bienvenido a Skate Park`,
    },
  })
);

app.use(api);

app.use(front);


// 1. Crear una API REST con el Framework Express (2 Puntos)
// 2. Servir contenido dinámico con express-handlebars (1 Punto)
// 3. Ofrecer la funcionalidad Upload File con express-fileupload(1 Punto)
// 4. Implementar seguridad y restricción de recursos ocontenido con JWT (2 Puntos)
// 5. Aplicar testing E2E, con Cypressunavezquesehayafinalizadolaconstruccióndela
// aplicación, el mismo debe contener al menos 3 pruebas.(2 Puntos)
// a. Smoke test.
// b. Test a 1 input.
// c. Test a 1 botón.
// 6. Realizar la configuración necesaria del proyecto paraser desplegado en Heroku.
// (2 Puntos)