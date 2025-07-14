# 📊 JasperReports en Windows - Guía Completa

## 🚀 Instalación Rápida para Windows

### 1. Instalar Java 11+
```cmd
# Descargar desde: https://adoptium.net/
# Asegurarse de marcar "Add to PATH" durante la instalación
java -version
```

### 2. Instalar JasperStarter
```cmd
# Descargar desde: https://github.com/centic9/jasperstarter/releases
# Extraer en C:\jasperstarter
# Agregar C:\jasperstarter\bin al PATH del sistema
jasperstarter --version
```

### 3. Configurar el Proyecto
```cmd
cd backend
mkdir reports temp
# Copiar archivos .jasper a reports\
```

### 4. Probar Configuración
```cmd
node test-jasper-windows.js
```

## 📁 Estructura de Archivos

```
backend/
├── reports/                    # Archivos .jasper
│   └── reporte_empresa.jasper
├── temp/                      # PDFs temporales
├── controllers/
│   └── reportes.js           # Controlador principal
├── routes/
│   └── reportes.js           # Rutas de API
├── config/
│   └── jasper-config-windows.js
└── .env                      # Variables de entorno
```

## 🔗 Endpoints Disponibles

### Reporte de Empresa
```
GET /api/reportes/empresa/:idempresa?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
```

**Ejemplo:**
```
http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31
```

### Reporte Genérico
```
GET /api/reportes/:nombreReporte?param1=valor1&param2=valor2
```

### Listar Reportes
```
GET /api/reportes/disponibles
```

## 🧪 Pruebas en Windows

### Desde CMD
```cmd
curl "http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  --output reporte.pdf
```

### Desde PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31" `
  -Headers @{"Authorization"="Bearer YOUR_TOKEN"} `
  -OutFile "reporte.pdf"
```

### Desde Navegador
```
http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31
```

### Desde Postman
1. **Método:** GET
2. **URL:** `http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31`
3. **Headers:** `Authorization: Bearer YOUR_TOKEN`
4. **Send and Download:** ✅ Activar

## 🔧 Configuración Específica para Windows

### Variables de Entorno (.env)
```env
JASPER_STARTER_PATH=jasperstarter.bat
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.x-hotspot
DATABASE=siete_bd
USER=root
PASS=tu_password
```

### Rutas con Espacios
El código maneja automáticamente rutas con espacios usando comillas dobles:
```javascript
const command = `"${JASPER_STARTER_PATH}" process "${jasperPath}" -o "${outputFile}"`;
```

### Codificación de Caracteres
Se configura UTF-8 automáticamente para manejar caracteres especiales.

## 🐛 Solución de Problemas en Windows

### ❌ "jasperstarter no se reconoce como comando"
```cmd
# Verificar PATH
echo %PATH%

# Agregar manualmente al PATH
set PATH=%PATH%;C:\jasperstarter\bin

# O usar ruta completa
C:\jasperstarter\bin\jasperstarter.bat --version
```

### ❌ "JAVA_HOME not set"
```cmd
# Configurar JAVA_HOME
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.x-hotspot
set PATH=%PATH%;%JAVA_HOME%\bin
```

### ❌ Error de permisos
1. Ejecutar CMD como **Administrador**
2. Verificar permisos de carpetas `reports` y `temp`
3. Usar `icacls` para dar permisos:
```cmd
icacls reports /grant Users:F
icacls temp /grant Users:F
```

### ❌ Error "Cannot find module"
```cmd
# Reinstalar dependencias
npm install
```

### ❌ Timeout en generación
- Aumentar timeout en `jasper-config-windows.js`
- Verificar que el archivo .jasper no esté corrupto
- Verificar conexión a base de datos

## 📝 Logs y Debugging

Los logs aparecen en la consola:
```
🔧 Validando configuración para Windows...
📁 Directorio de reportes creado: C:\proyecto\backend\reports
✅ Permisos de escritura verificados
Ejecutando comando: "jasperstarter.bat" process "C:\proyecto\backend\reports\reporte_empresa.jasper"...
Reporte generado exitosamente
🗑️ Archivo temporal eliminado: reporte_empresa_1_1640995200000.pdf
```

## 🚀 Script de Inicio Automático

Crear `start-windows.bat`:
```batch
@echo off
echo Iniciando servidor de reportes...

REM Verificar Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java no esta instalado
    pause
    exit /b 1
)

REM Verificar JasperStarter
jasperstarter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: JasperStarter no esta instalado
    pause
    exit /b 1
)

REM Crear directorios
if not exist "reports" mkdir reports
if not exist "temp" mkdir temp

REM Iniciar servidor
echo Iniciando servidor Node.js...
npm start
```

## 🔒 Consideraciones de Seguridad

- Validación de parámetros de entrada
- Limpieza automática de archivos temporales
- Timeout para evitar procesos colgados
- Autenticación JWT requerida
- Sanitización de nombres de archivo

## 📈 Optimización para Windows

- Uso de `windowsHide: true` para ocultar ventanas de comando
- Manejo específico de rutas con espacios
- Configuración de codificación UTF-8
- Timeout aumentado para sistemas más lentos
- Limpieza automática más frecuente

## 🎯 Próximos Pasos

1. **Copiar archivos .jasper** a `backend\reports\`
2. **Configurar .env** con credenciales de BD
3. **Probar configuración** con `node test-jasper-windows.js`
4. **Iniciar servidor** con `npm start`
5. **Probar endpoint** desde Postman o navegador