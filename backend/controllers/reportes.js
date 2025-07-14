const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuración de rutas para Windows
const JASPER_STARTER_PATH = process.env.JASPER_STARTER_PATH || 'jasperstarter.bat';
const REPORTS_DIR = path.join(__dirname, '../reports'); // Carpeta donde están los .jasper
const TEMP_DIR = path.join(__dirname, '../temp'); // Carpeta temporal para PDFs

// Asegurar que existe la carpeta temporal
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Generar reporte PDF usando JasperStarter en Windows
 * @param {string} jasperFile - Nombre del archivo .jasper
 * @param {Object} params - Parámetros para el reporte
 * @param {string} outputFile - Ruta del archivo de salida
 * @returns {Promise<string>} - Ruta del archivo generado
 */
const generateReport = async (jasperFile, params, outputFile) => {
  try {
    const jasperPath = path.join(REPORTS_DIR, jasperFile);
    
    // Verificar que existe el archivo .jasper
    if (!fs.existsSync(jasperPath)) {
      throw new Error(`Archivo .jasper no encontrado: ${jasperPath}`);
    }

    // Construir parámetros para JasperStarter
    const paramString = Object.entries(params)
      .map(([key, value]) => `-P "${key}=${value}"`)
      .join(' ');

    // Comando JasperStarter para Windows (usar comillas dobles)
    const command = `"${JASPER_STARTER_PATH}" process "${jasperPath}" -o "${outputFile}" -f pdf ${paramString}`;
    
    console.log('Ejecutando comando:', command);
    
    // Ejecutar el comando con timeout
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 segundos
      windowsHide: true // Ocultar ventana de comando en Windows
    });
    
    if (stderr && !stderr.includes('INFO')) {
      console.error('Error en JasperStarter:', stderr);
      throw new Error(`Error al generar reporte: ${stderr}`);
    }
    
    console.log('Reporte generado exitosamente:', stdout);
    return `${outputFile}.pdf`;
    
  } catch (error) {
    console.error('Error al generar reporte:', error);
    throw error;
  }
};

/**
 * Endpoint para generar reporte de empresa
 */
const getReporteEmpresa = async (req, res) => {
  try {
    const { idempresa } = req.params;
    const { desde, hasta } = req.query;

    // Validar parámetros requeridos
    if (!idempresa || !desde || !hasta) {
      return res.status(400).json({
        error: 'Parámetros requeridos: idempresa, desde, hasta'
      });
    }

    // Validar formato de fechas
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    
    if (isNaN(fechaDesde.getTime()) || isNaN(fechaHasta.getTime())) {
      return res.status(400).json({
        error: 'Formato de fecha inválido. Use YYYY-MM-DD'
      });
    }

    // Parámetros para el reporte
    const params = {
      DESDE: desde,
      HASTA: hasta,
      IDEMPRESA: idempresa
    };

    // Nombre único para el archivo temporal
    const timestamp = Date.now();
    const outputFileName = `reporte_empresa_${idempresa}_${timestamp}`;
    const outputPath = path.join(TEMP_DIR, outputFileName);

    // Generar el reporte
    const pdfPath = await generateReport('reporte_empresa.jasper', params, outputPath);

    // Verificar que se generó el archivo
    if (!fs.existsSync(pdfPath)) {
      throw new Error('El archivo PDF no se generó correctamente');
    }

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="reporte_empresa_${idempresa}.pdf"`);

    // Enviar el archivo
    res.sendFile(path.resolve(pdfPath), (err) => {
      if (err) {
        console.error('Error al enviar archivo:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al enviar el archivo PDF' });
        }
      } else {
        // Eliminar archivo temporal después de enviarlo
        setTimeout(() => {
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
            console.log('Archivo temporal eliminado:', pdfPath);
          }
        }, 5000); // Esperar 5 segundos antes de eliminar
      }
    });

  } catch (error) {
    console.error('Error en getReporteEmpresa:', error);
    res.status(500).json({
      error: 'Error al generar el reporte',
      details: error.message
    });
  }
};

/**
 * Endpoint para listar reportes disponibles
 */
const getReportesDisponibles = async (req, res) => {
  try {
    const reportes = fs.readdirSync(REPORTS_DIR)
      .filter(file => file.endsWith('.jasper'))
      .map(file => ({
        nombre: file,
        ruta: path.join(REPORTS_DIR, file)
      }));

    res.json({
      reportes,
      total: reportes.length
    });
  } catch (error) {
    console.error('Error al listar reportes:', error);
    res.status(500).json({
      error: 'Error al obtener lista de reportes'
    });
  }
};

/**
 * Endpoint genérico para cualquier reporte
 */
const getReporteGenerico = async (req, res) => {
  try {
    const { nombreReporte } = req.params;
    const params = req.query;

    // Validar que existe el archivo
    const jasperFile = `${nombreReporte}.jasper`;
    const jasperPath = path.join(REPORTS_DIR, jasperFile);
    
    if (!fs.existsSync(jasperPath)) {
      return res.status(404).json({
        error: `Reporte no encontrado: ${nombreReporte}`
      });
    }

    // Nombre único para el archivo temporal
    const timestamp = Date.now();
    const outputFileName = `${nombreReporte}_${timestamp}`;
    const outputPath = path.join(TEMP_DIR, outputFileName);

    // Generar el reporte
    const pdfPath = await generateReport(jasperFile, params, outputPath);

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreReporte}.pdf"`);

    // Enviar el archivo
    res.sendFile(path.resolve(pdfPath), (err) => {
      if (err) {
        console.error('Error al enviar archivo:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al enviar el archivo PDF' });
        }
      } else {
        // Eliminar archivo temporal
        setTimeout(() => {
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
          }
        }, 5000);
      }
    });

  } catch (error) {
    console.error('Error en getReporteGenerico:', error);
    res.status(500).json({
      error: 'Error al generar el reporte',
      details: error.message
    });
  }
};

module.exports = {
  getReporteEmpresa,
  getReportesDisponibles,
  getReporteGenerico
};