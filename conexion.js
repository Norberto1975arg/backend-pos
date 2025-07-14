// conexion.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '162.241.60.16', // dentro del mismo servidor
  user: 'eltoque1_sistemapos_user', // usuario que creaste en cPanel
  password: 'mUQXjX+Ryc6qtsq',  // reemplazá esto por tu contraseña real
  database: 'eltoque1_sistema_pos'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

module.exports = connection;
