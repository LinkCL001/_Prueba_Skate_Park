# Despliegue y Contenedores

## Estructura del proyecto

```bash
└── src
    ├── routes.js
    └── controllers
        ├── login.js
        └── skaters.js
    └── models
        └── db.js
└── migrate.js
└── rutas
    └── front.js
    └── public
        └── imgs
        └── css
└── server.js
└── Assets
    └── img
└── views
    ├── Dashboard.handlebars
    ├── Login.handlebars
    ├── error.hadlebars
    ├── Registro.handlebars
    ├── Admin.handlebars
    ├── Datos.handlebars
    └── layouts
        └── main.handlebars
    └── component
        └── Admin.handlebars
        └── Datos.handlebars
        └── Home.handlebars
└── data.sql
```

## Tabla PostgreSQL requerida

Antes de correr este proyecto asegúrate de tener esta tabla creada
se agregó admin como boolean para poder cambiar desde la base de datos al administrador
```sql
CREATE DATABASE skatepark;

CREATE TABLE skaters (id SERIAL, email VARCHAR(50) NOT NULL,  nombre
VARCHAR(25) NOT NULL, password VARCHAR(25) NOT NULL, anos_experiencia
INT NOT NULL, especialidad VARCHAR(50) NOT NULL, foto VARCHAR(255) NOT
NULL, estado BOOLEAN NOT NULL, admin BOOLEAN DEFAULT false);

## Correr localmente

Primero editáis el .env con tus propios datos

```bash
npm i

# correr normalmente
npm start

# o si quieres seguir desarrollando
npm run dev
```

## Correr en Heroku

Después de logearte con la cli de heroku

**recuerda montar postgres en heroku y tener creada la tabla previamente definida**

```bash
# en caso de
rm -rf .git

git init

heroku git:remote -a your-app-repo

git add .
git commit -am "make it better"
git push heroku master
```
https://link-app22.herokuapp.com/