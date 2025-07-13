const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Script de prueba para verificar la configuración de JasperReports
 */

console.log('🧪 Iniciando pruebas de JasperReports...\n');

// 1. Verificar Java
console.log('1️⃣ Verificando Java...');
exec('java -version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Java no está instalado:', error.message);
  } else {
    console.log('✅ Java instalado:', stderr.split('\n')[0]);
  }
  
  // 2. Verificar JasperStarter
  console.log('\n2️⃣ Verificando JasperStarter...');
  exec('jasperstarter --version', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ JasperStarter no está instalado:', error.message);
      console.log('💡 Instale JasperStarter siguiendo las instrucciones en install-jasper.md');
    } else {
      console.log('✅ JasperStarter instalado:', stdout.trim());
    }
    
    // 3. Verificar directorios
    console.log('\n3️⃣ Verificando directorios...');
    const reportsDir = path.join(__dirname, 'reports');
    const tempDir = path.join(__dirname, 'temp');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log('📁 Directorio reports creado:', reportsDir);
    } else {
      console.log('✅ Directorio reports existe:', reportsDir);
    }
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log('📁 Directorio temp creado:', tempDir);
    } else {
      console.log('✅ Directorio temp existe:', tempDir);
    }
    
    // 4. Listar archivos .jasper
    console.log('\n4️⃣ Archivos .jasper encontrados:');
    try {
      const jasperFiles = fs.readdirSync(reportsDir)
        .filter(file => file.endsWith('.jasper'));
      
      if (jasperFiles.length === 0) {
        console.log('⚠️  No se encontraron archivos .jasper en:', reportsDir);
        console.log('💡 Copie sus archivos .jasper al directorio reports/');
      } else {
        jasperFiles.forEach(file => {
          console.log(`✅ ${file}`);
        });
      }
    } catch (error) {
      console.error('❌ Error al leer directorio reports:', error.message);
    }
    
    // 5. Verificar variables de entorno
    console.log('\n5️⃣ Variables de entorno:');
    console.log('JAVA_HOME:', process.env.JAVA_HOME || '❌ No configurado');
    console.log('JASPER_STARTER_PATH:', process.env.JASPER_STARTER_PATH || '⚠️  Usando valor por defecto');
    console.log('DATABASE:', process.env.DATABASE || '⚠️  No configurado');
    
    console.log('\n🎉 Pruebas completadas!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Copie sus archivos .jasper al directorio reports/');
    console.log('2. Configure las variables de entorno en .env');
    console.log('3. Inicie el servidor: npm start');
    console.log('4. Pruebe el endpoint: GET /api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31');
  });
});