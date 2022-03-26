require("dotenv").config();
const { Pool } = require("pg");

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

const eliminar = (id) => pool.query("DELETE FROM skaters WHERE id = $1", [id]);

const update = async (id, data) => {
  try {
    const updateSkater = await pool.query(
      `UPDATE skaters SET email = '${data.email}', nombre = '${data.nombre}', password = '${data.password}', anos_experiencia = '${data.anos_experiencia}', especialidad = '${data.especialidad}'  WHERE id = ${id} RETURNING*`
    );
    return updateSkater.rows;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const updateStatus = async (id, estado) => {
  try { 
    console.log(id, estado);
    const result = await pool.query(
      `UPDATE skaters SET estado = ${estado} WHERE id = ${id} RETURNING*`
    );
    console.log(result);
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
