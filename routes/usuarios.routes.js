const express = require('express');
const router = express.Router();
const connection = require('../conexion');

// Crear usuario con validación previa de nombre_usuario
router.post('/', (req, res) => {
  const { nombre, nombre_usuario, password, id_rol, id_sucursal } = req.body;

  if (!nombre || !nombre_usuario || !password || !id_rol || !id_sucursal) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  const verificarSQL = `SELECT * FROM usuarios WHERE nombre_usuario = ?`;
  connection.query(verificarSQL, [nombre_usuario], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar usuario:', err.message);
      return res.status(500).json({ mensaje: 'Error al verificar usuario', error: err });
    }

    if (results.length > 0) {
      return res.status(409).json({ mensaje: '❌ El nombre de usuario ya existe. Elija otro.' });
    }

    const insertarSQL = `
      INSERT INTO usuarios (nombre, nombre_usuario, password, id_rol, id_sucursal)
      VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(insertarSQL, [nombre, nombre_usuario, password, id_rol, id_sucursal], (err, result) => {
      if (err) {
        console.error('❌ Error al crear usuario:', err.sqlMessage || err.message);
        return res.status(500).json({ mensaje: 'Error al crear usuario', error: err });
      }

      return res.status(200).json({
        mensaje: '✅ Usuario creado correctamente',
        idUsuario: result.insertId
      });
    });
  });
});

// ✅ LOGIN DEL USUARIO
router.post('/login', (req, res) => {
  const { nombre_usuario, password } = req.body;

  console.log('🟡 Login recibido:', nombre_usuario, password);

  const sql = `
    SELECT u.id_usuario AS id_usuario, u.nombre, u.nombre_usuario, u.id_sucursal, u.id_rol,
           s.nombre_sucursal, s.id_empresa,
           e.nombre_empresa, e.logo
    FROM usuarios u
    JOIN sucursal s ON u.id_sucursal = s.id_sucursal
    JOIN empresa e ON s.id_empresa = e.id_empresa
    WHERE u.nombre_usuario = ? AND u.password = ?
  `;

  connection.query(sql, [nombre_usuario, password], (err, result) => {
    if (err) {
      console.error('❌ Error en login SQL:', err.sqlMessage || err.message);
      return res.status(500).json({ mensaje: '❌ Error interno del servidor' });
    }

    if (result.length === 0) {
      return res.status(401).json({ mensaje: '❌ Usuario o contraseña incorrectos' });
    }

    const usuario = result[0];

    res.status(200).json({
      mensaje: '✅ Login exitoso',
      usuario: {
          id_usuario: usuario.id_usuario, // 👈 este es el importante
        nombre: usuario.nombre,
        nombre_usuario: usuario.nombre_usuario,
        id_sucursal: usuario.id_sucursal,
        id_rol: usuario.id_rol,
        nombre_sucursal: usuario.nombre_sucursal,
        nombre_empresa: usuario.nombre_empresa,
        logo_empresa: usuario.logo,
        id_empresa: usuario.id_empresa,
      }
    });
  });
});

module.exports = router;

