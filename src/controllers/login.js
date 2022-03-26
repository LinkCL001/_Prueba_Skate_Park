const jwt = require("jsonwebtoken");
const { login } = require('../models/db');
const secretKey = process.env["SECRET_KEY"];

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const skater = await login(email, password);

    if (skater) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 120,
          data: skater,
        },
        secretKey
      );
      return res.json({ token })
    }
    return res.json({ mensaje:'Usuario o contraseña incorrecta' })
}

module.exports = {
    loginUser
}