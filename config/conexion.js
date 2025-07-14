const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'eltoque1_sistemapos_user',
  password: 'r,?JbQR?QlkX',
  database: 'eltoque1_sistema_pos'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

module.exports = connection;
