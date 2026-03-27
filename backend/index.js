const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Validar configuración al arrancar
const requiredEnvVars = ['PORT', 'NODE_ENV'];
const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Por favor configura las variables de entorno faltantes');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';

// Middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: environment,
        version: process.env.APP_VERSION || 'v0.1.0',
        timestamp: new Date().toISOString()
    });
});

// Endpoint de mensaje (negocio simple)
app.get('/api/message', (req, res) => {
    res.json({
        message: `Hello from ${environment} environment!`,
        timestamp: new Date().toISOString()
    });
});

// Endpoint para feature flags (preparación para semana 2)
app.get('/api/feature-flags', (req, res) => {
    res.json({
        newUi: process.env.FEATURE_NEW_UI === 'true',
        debugMode: process.env.FEATURE_DEBUG === 'true'
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`✅ Backend server running at http://localhost:${port}`);
    console.log(`📦 Environment: ${environment}`);
    console.log(`🔧 Validated configuration: OK`);
});
