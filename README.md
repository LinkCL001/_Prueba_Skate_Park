# Despliegue y Contenedores

## Estructura del proyecto

```bash
└── db.js
└── migrate.js
└── rutas
    └── api.js
    └── front.js
    └── public
        └── imgs
└── server.js
└── Assets
    └── img
└── data
    └── admin.js
└── views
    ├── Dashboard.handlebars
    ├── Login.handlebars
    ├── error.hadlebars
    ├── Registro.handlebars
    └── layouts
        └── main.handlebars
    └── component
        └── Admin.handlebars
        └── Datos.handlebars
        └── Home.handlebars
```

## Tabla PostgreSQL requerida

Antes de correr este proyecto asegúrate de tener esta tabla creada

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