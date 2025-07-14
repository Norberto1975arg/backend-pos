const express = require('express');
const router = express.Router();
const connection = require('../conexion'); // Asegurate de tener bien esta ruta

// GET para verificar o crear el rol
router.get('/', (req, res) => {
  const { sucursal, rol } = req.query;

  // Validar parámetros
  if (!sucursal || !rol) {
    return res.status(400).json({ mensaje: 'Faltan parámetros: sucursal o rol' });
  }

  // Verificar si ya existe el rol
  const sqlBuscar = 'SELECT id_rol FROM roles WHERE id_sucursal = ? AND rol = ? LIMIT 1';
  connection.query(sqlBuscar, [sucursal, rol], (errBuscar, resultados) => {
    if (errBuscar) {
      console.error('❌ Error al buscar rol:', errBuscar.sqlMessage || errBuscar.message);
      return res.status(500).json({ mensaje: 'Error al buscar rol', error: errBuscar });
    }

    // Si ya existe, lo devolvemos
    if (resultados.length > 0) {
      return res.status(200).json({
        id: resultados[0].id_rol,
        mensaje: 'Rol existente'
      });
    }

    // Si no existe, lo creamos
    const sqlInsertar = 'INSERT INTO roles (rol, id_sucursal) VALUES (?, ?)';
    connection.query(sqlInsertar, [rol, sucursal], (errInsertar, resultadoInsert) => {
      if (errInsertar) {
        console.error('❌ Error al crear rol:', errInsertar.sqlMessage || errInsertar.message);
        return res.status(500).json({ mensaje: 'Error al crear rol', error: errInsertar });
      }

      res.status(200).json({
        id: resultadoInsert.insertId,
        mensaje: '✅ Rol creado correctamente'
      });
    });
  });
});

module.exports = router;

