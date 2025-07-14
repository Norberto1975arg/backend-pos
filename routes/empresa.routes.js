const express = require('express');
const router = express.Router();
const connection = require('../conexion');

// Ruta para crear una nueva empresa
router.post('/', (req, res) => {
  const { nombre_empresa, logo } = req.body;

  // ✅ Mostrar los datos que llegan desde el frontend
  console.log('📥 Recibido desde frontend:', { nombre_empresa, logo });

  const sql = `INSERT INTO empresa (nombre_empresa, logo) VALUES (?, ?)`;

  connection.query(sql, [nombre_empresa, logo], (err, result) => {
    if (err) {
      // ✅ Mostrar el error real de MySQL
      console.error('❌ Error al guardar empresa:', err.sqlMessage || err.message || err);
      return res.status(500).json({ mensaje: 'Error al guardar empresa' });
    }

    // ✅ Devolver ID generado
    res.status(200).json({
      mensaje: 'Empresa guardada correctamente',
      id: result.insertId
    });
  });
});

module.exports = router;
