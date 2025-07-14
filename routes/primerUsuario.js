const express = require('express');
const router = express.Router();
const connection = require('../conexion');

router.post('/primer-usuario', (req, res) => {
  const { nombre, nombre_usuario, password, id_sucursal } = req.body;

  if (!nombre || !nombre_usuario || !password || !id_sucursal) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  const sqlCheckRol = 'SELECT id_rol FROM roles WHERE id_sucursal = ? AND rol = ? LIMIT 1';

  connection.query(sqlCheckRol, [id_sucursal, 'superUsuario'], (errCheck, results) => {
    if (errCheck) {
      console.error('❌ Error al verificar rol superUsuario:', errCheck);
      return res.status(500).json({ mensaje: 'Error al verificar rol superUsuario' });
    }

    if (results.length > 0) {
      // Rol ya existe
      const id_rolExistente = results[0].id_rol;

      // Crear usuario con rol existente
      const sqlUsuario = `INSERT INTO usuarios (nombre, nombre_usuario, password, id_rol, id_sucursal) VALUES (?, ?, ?, ?, ?)`;
      connection.query(sqlUsuario, [nombre, nombre_usuario, password, id_rolExistente, id_sucursal], (errUsuario, resultUsuario) => {
        if (errUsuario) {
          console.error('❌ Error al guardar el primer usuario:', errUsuario);
          return res.status(500).json({ mensaje: 'Error al guardar el primer usuario' });
        }

        return res.status(200).json({
          mensaje: '✅ Usuario creado con rol superUsuario existente',
          idUsuario: resultUsuario.insertId,
          id_rol: id_rolExistente
        });
      });

    } else {
      // Rol no existe, crear rol primero
      const sqlRol = `INSERT INTO roles (rol, id_sucursal) VALUES (?, ?)`;
      connection.query(sqlRol, ['superUsuario', id_sucursal], (errRol, resultRol) => {
        if (errRol) {
          console.error('❌ Error al crear el rol superUsuario:', errRol);
          return res.status(500).json({ mensaje: 'Error al crear el rol superUsuario' });
        }

        const idRolNuevo = resultRol.insertId;

        // Crear usuario con nuevo rol
        const sqlUsuario = `INSERT INTO usuarios (nombre, nombre_usuario, password, idRol, id_sucursal) VALUES (?, ?, ?, ?, ?)`;
        connection.query(sqlUsuario, [nombre, nombre_usuario, password, idRolNuevo, id_sucursal], (errUsuario, resultUsuario) => {
          if (errUsuario) {
            console.error('❌ Error al guardar el primer usuario:', errUsuario);
            return res.status(500).json({ mensaje: 'Error al guardar el primer usuario' });
          }

          return res.status(200).json({
            mensaje: '✅ Primer usuario y rol superUsuario creados correctamente',
            idUsuario: resultUsuario.insertId,
            idRol: idRolNuevo
          });
        });
      });
    }
  });
});

module.exports = router;
