const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./conexion'); // Verifica conexión al iniciar

// ✅ Importar las rutas
const clientesRoutes = require('./routes/clientes.routes'); 
const empresaRoutes = require('./routes/empresa.routes');
const sucursalRoutes = require('./routes/sucursal.routes');
const rolesRoutes = require('./routes/roles.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const primerUsuarioRouter = require('./routes/primerUsuario');

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));

// ✅ Rutas del sistema
app.use('/api/clientes', clientesRoutes);
app.use('/api/empresa', empresaRoutes);
app.use('/api/sucursal', sucursalRoutes); 
app.use('/api/roles', rolesRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/primer-usuario', primerUsuarioRouter);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});



