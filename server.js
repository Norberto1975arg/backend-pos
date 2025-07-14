const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const clientesRoutes = require('./routes/clientes.routes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/clientes', clientesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
// 🔁 Cambio para forzar redeploy en Railway (Jul 14)
// 🔁 Cambio para forzar redeploy en Railway (Jul 14)
// 🔁 Forzar redeploy tras configurar variables compartidas
