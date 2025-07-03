// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./conexion');

const app = express();
const PORT = 3001; // Podés cambiar este puerto si querés

app.use(cors());
app.use(bodyParser.json());

// Ejemplo de ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente desde el servidor');
});

// Ejemplo para probar conexión con MySQL
app.get('/ping-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});
