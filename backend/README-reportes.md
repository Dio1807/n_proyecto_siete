# 📊 Sistema de Reportes JasperReports

## 🚀 Configuración Inicial

### 1. Instalación de Dependencias del Sistema
```bash
# Instalar Java 11 o superior
sudo apt install openjdk-11-jdk

# Descargar e instalar JasperStarter
wget https://github.com/centic9/jasperstarter/releases/download/v3.9.0/jasperstarter-3.9.0.zip
unzip jasperstarter-3.9.0.zip
sudo mv jasperstarter /opt/
sudo ln -s /opt/jasperstarter/bin/jasperstarter /usr/local/bin/
```

### 2. Configuración del Proyecto
```bash
# Crear directorios necesarios
mkdir -p backend/reports backend/temp

# Ejecutar script de prueba
node backend/test-jasper.js
```

### 3. Variables de Entorno (.env)
```env
JASPER_STARTER_PATH=jasperstarter
REPORTS_DIR=./reports
TEMP_DIR=./temp
```

## 📁 Estructura de Archivos

```
backend/
├── reports/                    # Archivos .jasper
│   └── reporte_empresa.jasper
├── temp/                      # PDFs temporales
├── config/
│   └── jasper-config.js       # Configuración
├── controllers/
│   └── reportes.js           # Lógica de reportes
├── routes/
│   └── reportes.js           # Rutas de API
├── middleware/
│   └── jasper-middleware.js  # Middlewares
├── utils/
│   └── jasper-utils.js       # Utilidades
└── test-jasper.js            # Script de prueba
```

## 🔗 Endpoints Disponibles

### 1. Reporte Específico de Empresa
```
GET /api/reportes/empresa/:idempresa?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
```

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output reporte.pdf
```

### 2. Reporte Genérico
```
GET /api/reportes/:nombreReporte?param1=valor1&param2=valor2
```

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/ventas?IDEMPRESA=1&DESDE=2024-01-01" \
  --output ventas.pdf
```

### 3. Listar Reportes Disponibles
```
GET /api/reportes/disponibles
```

**Respuesta:**
```json
{
  "reportes": [
    {
      "nombre": "reporte_empresa",
      "archivo": "reporte_empresa.jasper",
      "ruta": "/path/to/reports/reporte_empresa.jasper",
      "tamaño": 15420
    }
  ],
  "total": 1
}
```

## 🧪 Pruebas

### Desde Postman
1. **Método:** GET
2. **URL:** `http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31`
3. **Headers:** `Authorization: Bearer YOUR_TOKEN`
4. **Send and Download:** Activar para descargar el PDF

### Desde el Navegador
```
http://localhost:3000/api/reportes/empresa/1?desde=2024-01-01&hasta=2024-12-31
```

### Desde JavaScript (Frontend)
```javascript
// Descargar reporte
const descargarReporte = async (idEmpresa, desde, hasta) => {
  try {
    const response = await fetch(
      `/api/reportes/empresa/${idEmpresa}?desde=${desde}&hasta=${hasta}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_empresa_${idEmpresa}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error al descargar reporte:', error);
  }
};
```

## 🔧 Configuración Avanzada

### Conexión a Base de Datos
Los reportes pueden conectarse directamente a la BD usando los parámetros de conexión configurados en `jasper-config.js`.

### Parámetros Personalizados
Los reportes pueden recibir cualquier parámetro a través de query strings:
```
/api/reportes/mi-reporte?PARAM1=valor1&PARAM2=valor2&FECHA=2024-01-01
```

### Timeout y Limpieza
- **Timeout:** 30 segundos por defecto
- **Limpieza automática:** Archivos temporales se eliminan cada 5 minutos
- **Limpieza manual:** Archivos se eliminan 5 segundos después del envío

## 🐛 Solución de Problemas

### Error: "jasperstarter: command not found"
```bash
# Verificar instalación
which jasperstarter
jasperstarter --version

# Reinstalar si es necesario
sudo ln -s /opt/jasperstarter/bin/jasperstarter /usr/local/bin/
```

### Error: "JAVA_HOME not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
```

### Error: "Archivo .jasper no encontrado"
1. Verificar que el archivo existe en `backend/reports/`
2. Verificar permisos de lectura
3. Verificar que el nombre del archivo es correcto

### Error de conexión a BD
1. Verificar credenciales en `.env`
2. Verificar que el driver JDBC está instalado
3. Verificar conectividad a la base de datos

## 📝 Logs y Debugging

Los logs se muestran en la consola del servidor:
```
[REPORTE] GET /api/reportes/empresa/1 { params: { idempresa: '1' }, query: { desde: '2024-01-01', hasta: '2024-12-31' } }
Ejecutando comando: jasperstarter process ...
Reporte generado exitosamente
Archivo temporal eliminado: reporte_empresa_1_1640995200000.pdf
```

## 🔒 Seguridad

- Todos los endpoints requieren autenticación JWT
- Validación de parámetros de entrada
- Limpieza automática de archivos temporales
- Timeout para evitar procesos colgados

## 📈 Rendimiento

- Generación asíncrona de reportes
- Limpieza automática de archivos temporales
- Timeout configurable
- Logs detallados para monitoreo