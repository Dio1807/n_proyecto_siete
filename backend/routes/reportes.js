const { Router } = require('express');
const { 
  getReporteEmpresa, 
  getReportesDisponibles, 
  getReporteGenerico 
} = require('../controllers/reportes');

const router = Router();

// Ruta específica para reporte de empresa
router.get('/empresa/:idempresa', getReporteEmpresa);

// Ruta para listar reportes disponibles
router.get('/disponibles', getReportesDisponibles);

// Ruta genérica para cualquier reporte
router.get('/:nombreReporte', getReporteGenerico);

module.exports = router;