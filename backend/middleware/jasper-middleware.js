const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Middleware para validar que JasperStarter esté instalado
 */
const validateJasperStarter = async (req, res, next) => {
  try {
    await execAsync('jasperstarter --version');
    next();
  } catch (error) {
    console.error('JasperStarter no está instalado o no está en el PATH');
    res.status(500).json({
      error: 'JasperStarter no está configurado correctamente',
      details: 'Asegúrese de que JasperStarter esté instalado y en el PATH del sistema'
    });
  }
};

/**
 * Middleware para validar parámetros de fecha
 */
const validateDateParams = (req, res, next) => {
  const { desde, hasta } = req.query;
  
  if (desde && hasta) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    
    if (isNaN(fechaDesde.getTime()) || isNaN(fechaHasta.getTime())) {
      return res.status(400).json({
        error: 'Formato de fecha inválido',
        details: 'Use el formato YYYY-MM-DD para las fechas'
      });
    }
    
    if (fechaDesde > fechaHasta) {
      return res.status(400).json({
        error: 'Rango de fechas inválido',
        details: 'La fecha "desde" debe ser menor o igual a la fecha "hasta"'
      });
    }
  }
  
  next();
};

/**
 * Middleware para logging de reportes
 */
const logReportRequest = (req, res, next) => {
  const { method, originalUrl, params, query } = req;
  console.log(`[REPORTE] ${method} ${originalUrl}`, {
    params,
    query,
    timestamp: new Date().toISOString()
  });
  next();
};

module.exports = {
  validateJasperStarter,
  validateDateParams,
  logReportRequest
};