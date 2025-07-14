const express = require('express');
const router = express.Router();
const connection = require('../conexion');

router.post('/', (req, res) => {
  const nuevoEmpleado = req.body;

  const sql = `
    INSERT INTO empleados 
    (nombre, cedula, telefono, direccion, fechaNacimiento, usuario, contraseña, id_rol)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    nuevoEmpleado.nombre,
    nuevoEmpleado.cedula,
    nuevoEmpleado.telefono,
    nuevoEmpleado.direccion,
    nuevoEmpleado.fechaNacimiento,
    nuevoEmpleado.usuario,
    nuevoEmpleado.contraseña,
    nuevoEmpleado.id_rol
  ];

  connection.query(sql, valores, (err, result) => {
    if (err) {
      console.error('❌ Error al insertar empleado:', err);
      return res.status(500).json({ mensaje: 'Error al guardar empleado' });
    }
    res.status(200).json({ mensaje: 'Empleado guardado exitosamente' });
  });
});
module.exports = router;


