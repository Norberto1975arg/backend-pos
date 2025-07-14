const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'TU_USUARIO_MYSQL',
  password: 'TU_CONTRASEÑA',
  database: 'nombre_de_tu_base_de_datos'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;
