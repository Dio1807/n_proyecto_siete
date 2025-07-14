const path = require('path');
const fs = require('fs');

// Configuración específica para Windows
const jasperConfig = {
  // Ruta de JasperStarter para Windows
  jasperStarterPath: process.env.JASPER_STARTER_PATH || 'jasperstarter.bat',
  
  // Directorio de reportes .jasper (usar path.resolve para rutas absolutas en Windows)
  reportsDir: path.resolve(__dirname, '../reports'),
  
  // Directorio temporal para PDFs generados
  tempDir: path.resolve(__dirname, '../temp'),
  
  // Configuración de base de datos
  database: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DATABASE || 'siete_bd',
    username: process.env.USER || 'root',
    password: process.env.PASS || '',
    
    // String de conexión JDBC para Windows
    getJdbcUrl() {
      return `jdbc:mysql://${this.host}:${this.port}/${this.database}?useSSL=false&allowPublicKeyRetrieval=true`;
    },
    
    // Driver JDBC
    driver: 'com.mysql.cj.jdbc.Driver'
  },
  
  // Configuración específica para Windows
  windows: {
    // Usar comillas dobles para rutas con espacios
    useDoubleQuotes: true,
    
    // Ocultar ventana de comando
    windowsHide: true,
    
    // Codificación de caracteres
    encoding: 'utf8',
    
    // Variables de entorno adicionales
    env: {
      ...process.env,
      JAVA_TOOL_OPTIONS: '-Dfile.encoding=UTF-8'
    }
  },
  
  // Timeout para generación de reportes (más tiempo en Windows)
  timeout: 45000, // 45 segundos
  
  // Configuración de limpieza de archivos temporales
  cleanupInterval: 300000, // 5 minutos
  
  // Validar configuración específica para Windows
  validate() {
    console.log('🔧 Validando configuración para Windows...');
    
    // Verificar que estamos en Windows
    if (process.platform !== 'win32') {
      console.warn('⚠️  Esta configuración está optimizada para Windows');
    }
    
    // Crear directorios si no existen
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
      console.log('📁 Directorio de reportes creado:', this.reportsDir);
    }
    
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
      console.log('📁 Directorio temporal creado:', this.tempDir);
    }
    
    // Verificar permisos de escritura
    try {
      const testFile = path.join(this.tempDir, 'test.txt');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log('✅ Permisos de escritura verificados');
    } catch (error) {
      console.error('❌ Error de permisos de escritura:', error.message);
      console.log('💡 Ejecute como Administrador o verifique permisos de carpeta');
    }
    
    // Verificar variables de entorno importantes
    if (!process.env.JAVA_HOME) {
      console.warn('⚠️  JAVA_HOME no está configurado');
      console.log('💡 Configure JAVA_HOME en las variables de entorno del sistema');
    }
    
    return true;
  },
  
  // Construir comando para Windows
  buildCommand(jasperPath, outputPath, params, useDatabase = false) {
    const parts = [`"${this.jasperStarterPath}"`];
    
    parts.push('process');
    parts.push(`"${jasperPath}"`);
    parts.push('-o');
    parts.push(`"${outputPath}"`);
    parts.push('-f');
    parts.push('pdf');
    
    // Agregar conexión a BD si es necesario
    if (useDatabase) {
      const db = this.database;
      parts.push('-t', db.type);
      parts.push('-H', db.host);
      parts.push('-u', db.username);
      parts.push('-p', db.password);
      parts.push('-n', db.database);
      parts.push('--db-port', db.port.toString());
    }
    
    // Agregar parámetros
    Object.entries(params).forEach(([key, value]) => {
      parts.push('-P');
      parts.push(`"${key}=${value}"`);
    });
    
    return parts.join(' ');
  }
};

// Inicializar configuración
jasperConfig.validate();

// Limpiar archivos temporales periódicamente
const cleanupInterval = setInterval(() => {
  try {
    const files = fs.readdirSync(jasperConfig.tempDir);
    const now = Date.now();
    let cleaned = 0;
    
    files.forEach(file => {
      try {
        const filePath = path.join(jasperConfig.tempDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();
        
        // Eliminar archivos más antiguos que 10 minutos
        if (fileAge > 600000) {
          fs.unlinkSync(filePath);
          cleaned++;
          console.log('🗑️  Archivo temporal eliminado:', file);
        }
      } catch (error) {
        // Ignorar errores de archivos individuales
      }
    });
    
    if (cleaned > 0) {
      console.log(`🧹 Limpieza completada: ${cleaned} archivos eliminados`);
    }
  } catch (error) {
    console.error('❌ Error en limpieza de archivos temporales:', error.message);
  }
}, jasperConfig.cleanupInterval);

// Limpiar al cerrar la aplicación
process.on('SIGINT', () => {
  clearInterval(cleanupInterval);
  console.log('🛑 Limpieza de archivos temporales detenida');
  process.exit(0);
});

process.on('SIGTERM', () => {
  clearInterval(cleanupInterval);
  console.log('🛑 Limpieza de archivos temporales detenida');
  process.exit(0);
});

module.exports = jasperConfig;