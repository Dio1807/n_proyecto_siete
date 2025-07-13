const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const jasperConfig = require('../config/jasper-config');

const execAsync = promisify(exec);

/**
 * Utilidades para trabajar con JasperReports
 */
class JasperUtils {
  
  /**
   * Generar reporte con conexión a base de datos
   */
  static async generateReportWithDB(jasperFile, params, outputFile) {
    try {
      const jasperPath = path.join(jasperConfig.reportsDir, jasperFile);
      const { database } = jasperConfig;
      
      // Construir parámetros
      const paramString = Object.entries(params)
        .map(([key, value]) => `-P ${key}="${value}"`)
        .join(' ');
      
      // Comando con conexión a BD
      const command = [
        jasperConfig.jasperStarterPath,
        'process',
        jasperPath,
        '-o', outputFile,
        '-f', 'pdf',
        '-t', database.type,
        '-H', database.host,
        '-u', database.username,
        '-p', database.password,
        '-n', database.database,
        '--db-port', database.port,
        paramString
      ].join(' ');
      
      console.log('Ejecutando comando con BD:', command);
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: jasperConfig.timeout
      });
      
      if (stderr && !stderr.includes('INFO')) {
        throw new Error(`Error en JasperStarter: ${stderr}`);
      }
      
      return `${outputFile}.pdf`;
      
    } catch (error) {
      console.error('Error al generar reporte con BD:', error);
      throw error;
    }
  }
  
  /**
   * Generar reporte sin conexión a BD (datos pasados como parámetros)
   */
  static async generateReportWithoutDB(jasperFile, params, outputFile) {
    try {
      const jasperPath = path.join(jasperConfig.reportsDir, jasperFile);
      
      // Construir parámetros
      const paramString = Object.entries(params)
        .map(([key, value]) => `-P ${key}="${value}"`)
        .join(' ');
      
      // Comando sin conexión a BD
      const command = [
        jasperConfig.jasperStarterPath,
        'process',
        jasperPath,
        '-o', outputFile,
        '-f', 'pdf',
        paramString
      ].join(' ');
      
      console.log('Ejecutando comando sin BD:', command);
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: jasperConfig.timeout
      });
      
      if (stderr && !stderr.includes('INFO')) {
        throw new Error(`Error en JasperStarter: ${stderr}`);
      }
      
      return `${outputFile}.pdf`;
      
    } catch (error) {
      console.error('Error al generar reporte sin BD:', error);
      throw error;
    }
  }
  
  /**
   * Validar que existe un archivo .jasper
   */
  static validateJasperFile(jasperFile) {
    const jasperPath = path.join(jasperConfig.reportsDir, jasperFile);
    return fs.existsSync(jasperPath);
  }
  
  /**
   * Obtener lista de reportes disponibles
   */
  static getAvailableReports() {
    try {
      return fs.readdirSync(jasperConfig.reportsDir)
        .filter(file => file.endsWith('.jasper'))
        .map(file => ({
          nombre: file.replace('.jasper', ''),
          archivo: file,
          ruta: path.join(jasperConfig.reportsDir, file),
          tamaño: fs.statSync(path.join(jasperConfig.reportsDir, file)).size
        }));
    } catch (error) {
      console.error('Error al obtener reportes disponibles:', error);
      return [];
    }
  }
  
  /**
   * Limpiar archivos temporales antiguos
   */
  static cleanupTempFiles(maxAge = 600000) { // 10 minutos por defecto
    try {
      const files = fs.readdirSync(jasperConfig.tempDir);
      const now = Date.now();
      let cleaned = 0;
      
      files.forEach(file => {
        const filePath = path.join(jasperConfig.tempDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();
        
        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      });
      
      console.log(`Archivos temporales limpiados: ${cleaned}`);
      return cleaned;
      
    } catch (error) {
      console.error('Error en limpieza de archivos temporales:', error);
      return 0;
    }
  }
  
  /**
   * Verificar que JasperStarter está instalado
   */
  static async checkJasperStarter() {
    try {
      const { stdout } = await execAsync(`${jasperConfig.jasperStarterPath} --version`);
      return {
        installed: true,
        version: stdout.trim()
      };
    } catch (error) {
      return {
        installed: false,
        error: error.message
      };
    }
  }
}

module.exports = JasperUtils;