const express = require('express');
const router = express.Router();
const connection = require('../conexion');

// ✅ Ruta de login que también devuelve id_empresa
router.post('/', (req, res) => {
  const { nombre_usuario, password } = req.body;

  const sql = `
    SELECT u.id_usuario AS id, u.nombre, u.nombre_usuario, u.id_sucursal, u.idRol,
           s.nombre_sucursal, s.id_empresa,
           e.nombre_empresa, e.logo
    FROM usuarios u
    JOIN sucursal s ON u.id_sucursal = s.id
    JOIN empresa e ON s.id_empresa = e.id_empresa
    WHERE u.nombre_usuario = ? AND u.password = ?
  `;

  connection.query(sql, [nombre_usuario, password], (err, result) => {
    if (err) {
      console.error('❌ Error en el login:', err);
      return res.status(500).json({ mensaje: '❌ Error interno del servidor' });
    }

    if (result.length === 0) {
      return res.status(401).json({ mensaje: '❌ Usuario o contraseña incorrectos' });
    }

    // ✅ Usuario válido, devolver toda la información esperada
    const usuario = {
      id: result[0].id,
      nombre: result[0].nombre,
      nombre_usuario: result[0].nombre_usuario,
      id_sucursal: result[0].id_sucursal,
      idRol: result[0].idRol,
      nombre_sucursal: result[0].nombre_sucursal,
      nombre_empresa: result[0].nombre_empresa,
      logo_empresa: result[0].logo,
      id_empresa: result[0].id_empresa // opcional, si lo necesitás por separado
    };

    res.status(200).json({ mensaje: '✅ Login exitoso', usuario });
  });
});

module.exports = router;
