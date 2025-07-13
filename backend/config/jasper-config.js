const path = require('path');
const fs = require('fs');

// Configuración de JasperReports
const jasperConfig = {
  // Ruta de JasperStarter (ajustar según instalación)
  jasperStarterPath: process.env.JASPER_STARTER_PATH || 'jasperstarter',
  
  // Directorio de reportes .jasper
  reportsDir: path.join(__dirname, '../reports'),
  
  // Directorio temporal para PDFs generados
  tempDir: path.join(__dirname, '../temp'),
  
  // Configuración de base de datos (si los reportes usan BD)
  database: {
    type: 'mysql', // mysql, postgresql, etc.
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DATABASE || 'siete_bd',
    username: process.env.USER || 'root',
    password: process.env.PASS || '',
    
    // String de conexión JDBC
    getJdbcUrl() {
      return `jdbc:mysql://${this.host}:${this.port}/${this.database}`;
    },
    
    // Driver JDBC
    driver: 'com.mysql.cj.jdbc.Driver'
  },
  
  // Configuración de timeout para generación de reportes
  timeout: 30000, // 30 segundos
  
  // Configuración de limpieza de archivos temporales
  cleanupInterval: 300000, // 5 minutos
  
  // Validar configuración
  validate() {
    // Crear directorios si no existen
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
      console.log('Directorio de reportes creado:', this.reportsDir);
    }
    
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
      console.log('Directorio temporal creado:', this.tempDir);
    }
    
    return true;
  }
};

// Inicializar configuración
jasperConfig.validate();

// Limpiar archivos temporales periódicamente
setInterval(() => {
  try {
    const files = fs.readdirSync(jasperConfig.tempDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(jasperConfig.tempDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtime.getTime();
      
      // Eliminar archivos más antiguos que 10 minutos
      if (fileAge > 600000) {
        fs.unlinkSync(filePath);
        console.log('Archivo temporal eliminado:', file);
      }
    });
  } catch (error) {
    console.error('Error en limpieza de archivos temporales:', error);
  }
}, jasperConfig.cleanupInterval);

module.exports = jasperConfig;