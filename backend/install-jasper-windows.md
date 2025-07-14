# Instalación de JasperReports en Windows

## 1. Instalar Java Development Kit (JDK)

### Descargar e Instalar Java 11 o superior
1. Ir a [Adoptium](https://adoptium.net/) o [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
2. Descargar **JDK 11** o superior para Windows x64
3. Ejecutar el instalador y seguir las instrucciones
4. **Importante:** Marcar la opción "Add to PATH" durante la instalación

### Verificar Instalación de Java
```cmd
java -version
javac -version
```

### Configurar Variables de Entorno (si no se hizo automáticamente)
1. Abrir **Panel de Control** → **Sistema** → **Configuración avanzada del sistema**
2. Hacer clic en **Variables de entorno**
3. En **Variables del sistema**, agregar/editar:
   - **JAVA_HOME**: `C:\Program Files\Eclipse Adoptium\jdk-11.0.x-hotspot`
   - **PATH**: Agregar `%JAVA_HOME%\bin`

## 2. Descargar e Instalar JasperStarter

### Descargar JasperStarter
1. Ir a [JasperStarter Releases](https://github.com/centic9/jasperstarter/releases)
2. Descargar la última versión: `jasperstarter-3.9.0.zip`
3. Extraer en una carpeta, por ejemplo: `C:\jasperstarter`

### Configurar JasperStarter
1. Agregar `C:\jasperstarter\bin` al **PATH** del sistema:
   - Panel de Control → Sistema → Variables de entorno
   - Editar la variable **PATH**
   - Agregar nueva entrada: `C:\jasperstarter\bin`

### Verificar Instalación
```cmd
jasperstarter --version
```
Debería mostrar: `JasperStarter 3.9.0`

## 3. Descargar Driver JDBC para MySQL

### MySQL Connector/J
1. Ir a [MySQL Connector/J](https://dev.mysql.com/downloads/connector/j/)
2. Descargar la versión más reciente (ZIP Archive)
3. Extraer el archivo `.jar`
4. Copiar `mysql-connector-java-8.0.x.jar` a `C:\jasperstarter\jdbc\`

## 4. Estructura de Directorios del Proyecto

```
backend/
├── reports/           # Archivos .jasper
│   └── reporte_empresa.jasper
├── temp/             # PDFs temporales
├── controllers/
│   └── reportes.js
└── routes/
    └── reportes.js
```

## 5. Variables de Entorno del Proyecto (.env)

```env
# JasperStarter (Windows)
JASPER_STARTER_PATH=jasperstarter.bat

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DATABASE=siete_bd
USER=root
PASS=tu_password

# Rutas
REPORTS_DIR=./reports
TEMP_DIR=./temp
```

## 6. Comandos de Prueba en Windows

### Probar JasperStarter desde CMD
```cmd
# Cambiar al directorio del proyecto
cd C:\ruta\a\tu\proyecto\backend

# Generar reporte sin BD
jasperstarter process reports\reporte.jasper -o temp\output -f pdf -P "PARAM1=valor1"

# Generar reporte con BD MySQL
jasperstarter process reports\reporte.jasper ^
  -o temp\output -f pdf ^
  -t mysql -H localhost -u root -p password -n database ^
  -P "DESDE=2024-01-01" -P "HASTA=2024-12-31"
```

### Probar desde PowerShell
```powershell
# Generar reporte
& jasperstarter process "reports\reporte.jasper" -o "temp\output" -f pdf -P "PARAM1=valor1"
```

## 7. Solución de Problemas Comunes en Windows

### Error: "jasperstarter no se reconoce como comando"
1. Verificar que `C:\jasperstarter\bin` está en el PATH
2. Reiniciar CMD/PowerShell después de cambiar PATH
3. Usar la ruta completa: `C:\jasperstarter\bin\jasperstarter.bat`

### Error: "JAVA_HOME not set"
1. Verificar variables de entorno:
   ```cmd
   echo %JAVA_HOME%
   echo %PATH%
   ```
2. Configurar manualmente:
   ```cmd
   set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.x-hotspot
   set PATH=%PATH%;%JAVA_HOME%\bin
   ```

### Error de permisos
1. Ejecutar CMD como **Administrador**
2. Verificar permisos de las carpetas `reports` y `temp`

### Error de conexión a BD
1. Verificar que MySQL está ejecutándose
2. Verificar credenciales en `.env`
3. Verificar que el driver JDBC está en `C:\jasperstarter\jdbc\`

## 8. Script de Prueba para Windows

Crear `test-jasper-windows.bat`:
```batch
@echo off
echo Probando configuracion de JasperReports en Windows...

echo.
echo 1. Verificando Java...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java no esta instalado
    pause
    exit /b 1
)

echo.
echo 2. Verificando JasperStarter...
jasperstarter --version
if %errorlevel% neq 0 (
    echo ERROR: JasperStarter no esta instalado
    pause
    exit /b 1
)

echo.
echo 3. Verificando directorios...
if not exist "reports" mkdir reports
if not exist "temp" mkdir temp

echo.
echo 4. Listando archivos .jasper...
dir reports\*.jasper

echo.
echo Configuracion completada exitosamente!
pause
```

## 9. Instalación Rápida (Script PowerShell)

Crear `install-jasper.ps1`:
```powershell
# Script de instalación automática para Windows
Write-Host "Instalando JasperReports para Windows..." -ForegroundColor Green

# Crear directorios
New-Item -ItemType Directory -Force -Path "reports"
New-Item -ItemType Directory -Force -Path "temp"

# Descargar JasperStarter (requiere internet)
$url = "https://github.com/centic9/jasperstarter/releases/download/v3.9.0/jasperstarter-3.9.0.zip"
$output = "jasperstarter.zip"

Write-Host "Descargando JasperStarter..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Extrayendo archivos..." -ForegroundColor Yellow
Expand-Archive -Path $output -DestinationPath "C:\" -Force

Write-Host "Configurando PATH..." -ForegroundColor Yellow
$env:PATH += ";C:\jasperstarter\bin"

Write-Host "Instalación completada!" -ForegroundColor Green
Write-Host "Reinicie su terminal y ejecute: jasperstarter --version" -ForegroundColor Cyan
```

Ejecutar como administrador:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-jasper.ps1
```