require("dotenv").config();
const { Pool } = require("pg");
const { unlink } = require("fs");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString, ssl: { rejectUnauthorized: false }, log: console.log }
    : undefined
);

const listar = () =>
  pool.query("SELECT * FROM skaters").then((res) => res.rows);

const buscar = async (skaterId) =>
  pool
    .query("SELECT * FROM skaters WHERE id = $1 LIMIT 1", [skaterId])
    .then((res) => {
      return res.rows;
    })
    .catch((e) => {
      console.log({ e });
    });

const login = async (email, password) =>
  pool
    .query("SELECT * FROM skaters WHERE email = $1 AND password = $2 LIMIT 1", [
      email,
      password,
    ])
    .then((res) => {
      return res.rows[0];
    })
    .catch((e) => {
      console.log({ e });
    });

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

const eliminar = async (id) => {
  try {
    const imagen = await pool.query(
      `SELECT foto FROM skaters WHERE id = '${id}'`
    );
    const srcImg = "./public/imgs" + imagen.rows[0].foto;
    const consulta = {
      text: "DELETE FROM skaters WHERE id = $1 RETURNING *;",
      values: [id],
    };
    const result = await pool.query(consulta);
    if (result.rowCount > 0) {
      unlink(srcImg, () => true);
    }
    return result.rowCount;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const update = async (data) => {
  const query =
    "UPDATE skaters SET nombre = $1, password = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $5 RETURNING*";
  const values = data;
  try {
    const result = await pool.query(consulta(query, values));
    return result.rows;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const updateStatus = async (estado, id) => {
  try {
    const result = await pool.query(
      `UPDATE skaters SET estado = ${estado} WHERE id = ${id} RETURNING *;`
    );
    return result.rowCount;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = {
  listar,
  buscar,
  ingresar,
  eliminar,
  login,
  update,
  updateStatus,
};
