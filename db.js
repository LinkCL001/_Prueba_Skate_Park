require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString, ssl: { rejectUnauthorized: false } }
    : undefined
);

const listar = () =>
  pool.query("SELECT * FROM skaters").then((res) => res.rows);

const buscar = (email, password) =>
  pool
    .query("SELECT * FROM skaters WHERE email = $1 AND password = $2", [
      email,
      password,
    ])
    .then((res) => res.rows[0]);
    
const ingresar = (x) =>
  pool.query(
    "INSERT INTO skaters(email,nombre,password,anos_experiencia,especialidad,foto,estado,admin) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
    [
      x.email,
      x.nombre,
      x.password,
      x.anos_experiencia,
      x.especialidad,
      x.foto,
      x.estado,
      x.admin,
    ]
  );
const eliminar = (id) => pool.query("DELETE FROM skaters WHERE id = $1", [id]);

module.exports = { listar, buscar, ingresar, eliminar };
