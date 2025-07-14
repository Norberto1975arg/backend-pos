const express = require('express');
const router = express.Router();
const connection = require('../conexion');

// ✅ Obtener todos los clientes de una sucursal
router.get('/', (req, res) => {
  const id_sucursal = req.query.sucursal;

  if (!id_sucursal) {
    return res.status(400).json({ mensaje: '❌ Debes enviar el parámetro "sucursal".' });
  }

  const sql = 'SELECT * FROM clientes WHERE id_sucursal = ?';

  connection.query(sql, [id_sucursal], (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener clientes:', err);
      return res.status(500).json({ mensaje: '❌ Error al obtener clientes' });
    }

    res.json(resultados);
  });
});

// ✅ Obtener el próximo ID de cliente por empresa
router.get('/proximo-id', (req, res) => {
  const id_empresa = req.query.empresa;

  if (!id_empresa) {
    return res.status(400).json({ mensaje: '❌ Falta el parámetro empresa' });
  }

  const sqlSucursales = `SELECT id_sucursal FROM sucursal WHERE id_empresa = ?`;
  connection.query(sqlSucursales, [id_empresa], (err, sucursales) => {
    if (err) {
      console.error('❌ Error al obtener sucursales:', err);
      return res.status(500).json({ mensaje: '❌ Error al obtener sucursales' });
    }

    if (sucursales.length === 0) {
      return res.status(404).json({ mensaje: '⚠️ No se encontraron sucursales para la empresa' });
    }

    const ids_sucursales = sucursales.map(s => s.id_sucursal);
    const placeholders = ids_sucursales.map(() => '?').join(',');
    const sqlClientes = `SELECT id_cliente FROM clientes WHERE id_sucursal IN (${placeholders})`;

    connection.query(sqlClientes, ids_sucursales, (err, clientes) => {
      if (err) {
        console.error('❌ Error al obtener clientes:', err);
        return res.status(500).json({ mensaje: '❌ Error al obtener clientes' });
      }

      let maxNum = 0;

      clientes.forEach(c => {
        const partes = c.id_cliente.split('-');
        if (partes.length === 2) {
          const num = parseInt(partes[1]);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });

      const proximoNumero = maxNum + 1;
      const proximoId = `CLI-${proximoNumero}`;
      res.json({ proximoId });
    });
  });
});

// ✅ Guardar un nuevo cliente
router.post('/', (req, res) => {
  const { id_cliente, nombre, telefono, direccion, barrio, nota, id_sucursal } = req.body;

  if (!id_cliente || !nombre || !telefono || !id_sucursal) {
    return res.status(400).json({
      mensaje: '⚠️ ID, Nombre, Teléfono e ID de sucursal son obligatorios.'
    });
  }

  const sql = `
    INSERT INTO clientes (id_cliente, nombre, telefono, direccion, barrio, nota, id_sucursal)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [id_cliente, nombre, telefono, direccion, barrio, nota, id_sucursal];

  connection.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error('❌ Error al guardar cliente:', err);
      return res.status(500).json({ mensaje: '❌ Error al guardar cliente' });
    }

    res.status(200).json({ mensaje: '✅ Cliente guardado con éxito', id_cliente });
  });
});

// ✅ Actualizar cliente existente
router.put('/', (req, res) => {
  const { id_cliente, nombre, telefono, direccion, barrio, nota, id_sucursal } = req.body;

  if (!id_cliente || !nombre || !telefono || !id_sucursal) {
    return res.status(400).json({
      mensaje: '⚠️ ID, Nombre, Teléfono e ID de sucursal son obligatorios.'
    });
  }

  const sql = `
    UPDATE clientes
    SET nombre = ?, telefono = ?, direccion = ?, barrio = ?, nota = ?
    WHERE id_cliente = ? AND id_sucursal = ?
  `;

  const valores = [nombre, telefono, direccion, barrio, nota, id_cliente, id_sucursal];

  connection.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error('❌ Error al actualizar cliente:', err);
      return res.status(500).json({ mensaje: '❌ Error al actualizar cliente' });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: '⚠️ Cliente no encontrado para actualizar.' });
    }

    res.status(200).json({ mensaje: '✅ Cliente actualizado con éxito', id_cliente });
  });
});

module.exports = router;


