const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Script de prueba para verificar la configuración de JasperReports en Windows
 */

console.log('🧪 Iniciando pruebas de JasperReports para Windows...\n');

// 1. Verificar Java
console.log('1️⃣ Verificando Java...');
exec('java -version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Java no está instalado:', error.message);
    console.log('💡 Descargue Java desde: https://adoptium.net/');
  } else {
    console.log('✅ Java instalado:', stderr.split('\n')[0]);
  }
  
  // 2. Verificar JasperStarter
  console.log('\n2️⃣ Verificando JasperStarter...');
  exec('jasperstarter --version', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ JasperStarter no está instalado:', error.message);
      console.log('💡 Siga las instrucciones en install-jasper-windows.md');
      
      // Intentar con .bat explícito
      exec('jasperstarter.bat --version', (error2, stdout2, stderr2) => {
        if (error2) {
          console.error('❌ JasperStarter.bat tampoco funciona');
        } else {
          console.log('✅ JasperStarter.bat funciona:', stdout2.trim());
          console.log('💡 Use JASPER_STARTER_PATH=jasperstarter.bat en .env');
        }
        continueTests();
      });
    } else {
      console.log('✅ JasperStarter instalado:', stdout.trim());
      continueTests();
    }
  });
});

function continueTests() {
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
      console.log('💡 Copie sus archivos .jasper al directorio reports\\');
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
  console.log('PATH contiene jasperstarter:', 
    process.env.PATH.includes('jasperstarter') ? '✅ Sí' : '⚠️  No encontrado');
  console.log('JASPER_STARTER_PATH:', process.env.JASPER_STARTER_PATH || '⚠️  Usando valor por defecto');
  console.log('DATABASE:', process.env.DATABASE || '⚠️  No configurado');
  
  // 6. Verificar sistema operativo
  console.log('\n6️⃣ Sistema operativo:');
  console.log('Plataforma:', process.platform);
  console.log('Arquitectura:', process.arch);
  
  if (process.platform !== 'win32') {
    console.log('⚠️  Este script está optimizado para Windows');
  } else {
    console.log('✅ Ejecutándose en Windows');
  }
  
  console.log('\n🎉 Pruebas completadas!');
  console.log('\n📋 Próximos pasos para Windows:');
  console.log('1. Copie sus archivos .jasper al directorio reports\\');
  console.log('2. Configure las variables de entorno en .env');
  console.log('3. Inicie el servidor: npm start');
  console.log('4. Pruebe el endpoint: GET /api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31');
  console.log('\n🔧 Si hay problemas:');
  console.log('- Ejecute CMD como Administrador');
  console.log('- Verifique que Java y JasperStarter están en el PATH');
  console.log('- Use jasperstarter.bat en lugar de jasperstarter si es necesario');
}

// Función para probar un comando específico
function testCommand(command, description) {
  console.log(`\n🧪 Probando: ${description}`);
  exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.log(`✅ Éxito: ${stdout || stderr}`);
    }
  });
}

// Pruebas adicionales específicas para Windows
console.log('\n🔍 Pruebas adicionales para Windows:');

// Verificar si PowerShell está disponible
testCommand('powershell -Command "Get-Host"', 'PowerShell');

// Verificar permisos de escritura
testCommand('echo test > temp\\test.txt && del temp\\test.txt', 'Permisos de escritura');