const connection = require('../conexion');

exports.obtenerClientes = (req, res) => {
  connection.query('SELECT * FROM clientes', (error, results) => {
    if (error) {
      console.error('❌ Error al obtener clientes:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
    } else {
      res.status(200).json(results);
    }
  });
};
