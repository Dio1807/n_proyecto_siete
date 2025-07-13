# Instalación y Configuración de JasperReports

## 1. Requisitos Previos

### Java Development Kit (JDK)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-11-jdk

# CentOS/RHEL
sudo yum install java-11-openjdk-devel

# Windows
# Descargar e instalar desde: https://adoptopenjdk.net/

# Verificar instalación
java -version
javac -version
```

### Variables de Entorno
```bash
# Linux/Mac - Agregar al ~/.bashrc o ~/.zshrc
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

# Windows - Variables de sistema
JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
PATH=%PATH%;%JAVA_HOME%\bin
```

## 2. Instalación de JasperStarter

### Descargar JasperStarter
```bash
# Crear directorio para JasperStarter
sudo mkdir -p /opt/jasperstarter

# Descargar la última versión
cd /tmp
wget https://github.com/centic9/jasperstarter/releases/download/v3.9.0/jasperstarter-3.9.0.zip

# Extraer
unzip jasperstarter-3.9.0.zip
sudo mv jasperstarter/* /opt/jasperstarter/

# Hacer ejecutable
sudo chmod +x /opt/jasperstarter/bin/jasperstarter
```

### Configurar PATH
```bash
# Linux/Mac
echo 'export PATH=$PATH:/opt/jasperstarter/bin' >> ~/.bashrc
source ~/.bashrc

# O crear enlace simbólico
sudo ln -s /opt/jasperstarter/bin/jasperstarter /usr/local/bin/jasperstarter
```

### Verificar Instalación
```bash
jasperstarter --version
# Debería mostrar: JasperStarter 3.9.0
```

## 3. Drivers de Base de Datos

### MySQL Driver
```bash
# Descargar MySQL Connector/J
cd /opt/jasperstarter/jdbc
sudo wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-8.0.33.jar

# O usando Maven (si tienes Maven instalado)
mvn dependency:get -Dartifact=mysql:mysql-connector-java:8.0.33
```

### PostgreSQL Driver
```bash
cd /opt/jasperstarter/jdbc
sudo wget https://jdbc.postgresql.org/download/postgresql-42.6.0.jar
```

## 4. Estructura de Directorios del Proyecto

```
backend/
├── reports/           # Archivos .jasper
│   ├── reporte_empresa.jasper
│   ├── reporte_ventas.jasper
│   └── reporte_balance.jasper
├── temp/             # PDFs temporales
├── config/
│   └── jasper-config.js
├── controllers/
│   └── reportes.js
├── routes/
│   └── reportes.js
└── utils/
    └── jasper-utils.js
```

## 5. Variables de Entorno (.env)

```env
# JasperStarter
JASPER_STARTER_PATH=jasperstarter

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

## 6. Comandos de Prueba

### Probar JasperStarter directamente
```bash
# Generar reporte sin BD
jasperstarter process reporte.jasper -o output -f pdf -P PARAM1="valor1"

# Generar reporte con BD MySQL
jasperstarter process reporte.jasper \
  -o output -f pdf \
  -t mysql -H localhost -u root -p password -n database \
  -P DESDE="2024-01-01" -P HASTA="2024-12-31"
```

### Probar desde Node.js
```javascript
const { exec } = require('child_process');

exec('jasperstarter --version', (error, stdout, stderr) => {
  if (error) {
    console.error('JasperStarter no está instalado:', error);
  } else {
    console.log('JasperStarter instalado:', stdout);
  }
});
```

## 7. Solución de Problemas Comunes

### Error: "jasperstarter: command not found"
```bash
# Verificar PATH
echo $PATH

# Verificar ubicación
which jasperstarter

# Reinstalar o agregar al PATH
export PATH=$PATH:/opt/jasperstarter/bin
```

### Error: "JAVA_HOME not set"
```bash
# Encontrar Java
which java
readlink -f $(which java)

# Configurar JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

### Error de conexión a BD
```bash
# Verificar driver JDBC
ls -la /opt/jasperstarter/jdbc/

# Descargar driver si falta
cd /opt/jasperstarter/jdbc
sudo wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-8.0.33.jar
```

### Permisos en Linux
```bash
# Dar permisos al directorio de reportes
sudo chown -R $USER:$USER /path/to/backend/reports
sudo chmod -R 755 /path/to/backend/reports

# Dar permisos al directorio temporal
sudo chown -R $USER:$USER /path/to/backend/temp
sudo chmod -R 755 /path/to/backend/temp
```

## 8. Instalación con Docker (Alternativa)

```dockerfile
FROM node:16-alpine

# Instalar Java
RUN apk add --no-cache openjdk11-jre

# Instalar JasperStarter
RUN wget https://github.com/centic9/jasperstarter/releases/download/v3.9.0/jasperstarter-3.9.0.zip \
    && unzip jasperstarter-3.9.0.zip \
    && mv jasperstarter /opt/ \
    && ln -s /opt/jasperstarter/bin/jasperstarter /usr/local/bin/

# Instalar drivers JDBC
RUN cd /opt/jasperstarter/jdbc \
    && wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-8.0.33.jar

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```