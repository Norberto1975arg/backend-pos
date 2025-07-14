const express = require('express');
const router = express.Router();
const connection = require('../conexion');

router.post('/', (req, res) => {
  const { nombre_sucursal, direccion, telefono, id_empresa } = req.body;

  const sqlSucursal = `INSERT INTO sucursal (nombre_sucursal, direccion, telefono, id_empresa) VALUES (?, ?, ?, ?)`;
  connection.query(sqlSucursal, [nombre_sucursal, direccion, telefono, id_empresa], (err, result) => {
    if (err) {
      console.error('❌ Error al guardar sucursal:', err);
      return res.status(500).json({ mensaje: 'Error al guardar sucursal' });
    }

    const idSucursal = result.insertId;

    res.status(200).json({id: result.insertId,
      mensaje: 'Sucursal creada correctamente',
      idSucursal
    });
  });
});

module.exports = router;



