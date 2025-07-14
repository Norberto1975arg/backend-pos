const connection = require('./conexion');

connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
  if (err) {
    console.error('❌ Error al hacer consulta de prueba:', err);
  } else {
    console.log('✅ Resultado de prueba:', results[0]);
  }

  connection.end(); // Cerramos la conexión
});
