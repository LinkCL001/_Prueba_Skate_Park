const {
  listar,
  buscar,
  ingresar,
  eliminar,
  update,
  updateStatus,
} = require('../models/db');

const getAll = async (req, res) => {
    const skaters = await listar();
    return res.json(skaters)
}
const getOne = async (req, res) => {
  const skaters = await buscar(id);
  return res.json(skaters)
}
const insertOne = async (req, res) => {
  const skaters = await ingresar(x);
  return res.json(skaters)
}
const deleteOne = async (req, res) => {
  const skaters = await eliminar(id);
  return res.json(skaters)
}
const updateOne = async (req, res) => {
  const skaters = await update(id, data);
  return res.json(skaters)
}
const upStatus = async (req, res) => {
  const skaters = await updateStatus(id, estado);
  return res.json(skaters)
}

module.exports = {
    getAll,
    getOne,
    insertOne,
    deleteOne,
    updateOne,
    upStatus

}