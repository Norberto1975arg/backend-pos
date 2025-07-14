const connection = require('../conexion');

// 👉 Crear un cliente
const createCliente = (req, res) => {
  const { nombre, telefono, direccion, barrio, nota, id_sucursal } = req.body;

  if (!nombre || !telefono || !id_sucursal) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  const sql = `
    INSERT INTO clientes (nombre, telefono, direccion, barrio, nota, id_sucursal)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const valores = [nombre, telefono, direccion, barrio, nota, id_sucursal];

  connection.query(sql, valores, (err, result) => {
    if (err) {
      console.error('❌ Error al guardar cliente:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor al guardar cliente' });
    }

    res.status(200).json({
      mensaje: '✅ Cliente guardado correctamente',
      id_cliente: result.insertId
    });
  });
};

// 👉 Obtener todos los clientes de una sucursal
const getClientes = (req, res) => {
  const { id_sucursal } = req.query;

  if (!id_sucursal) {
    return res.status(400).json({ mensaje: 'Falta el parámetro id_sucursal' });
  }

  const sql = 'SELECT * FROM clientes WHERE id_sucursal = ?';

  connection.que
