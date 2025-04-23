# Taller 1 - Arquitecturas de Sistemas
Este repositorio contiene el código desarrollado para el primer taller del curso "Arquitecturas de Sistemas". En este se desarrolla la plataforma ficticia **Streamflow** y consta de cuatro modulos, cada uno con su respectiva base de datos.

## Integrantes
- **Luis Ardiles Castillo - 20.972.802-8**
- **Jairo Calcina Valda - 20.734.228-9**

## Pre-requisitos
- [Node.js](https://nodejs.org/es/) (version 22.14.0)
- [MariaDB](https://mariadb.org/) (version 10.7.4)
- [MongoDB](https://www.mongodb.com/try/download/community) (version 5.0.3)
- [PostgreSQL](https://www.postgresql.org/download/) (version 17)

## Instalación y configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/Broukt/streamflow
```

2. **Ingresar al directorio del proyecto**
```bash
cd streamflow
```

3. **Instalar las dependencias**
```bash
npm install
```

4. **Crear un archivo `.env` en la raíz del proyecto y ingresar las variables de entorno**
```bash
cp .env.example .env
```

5. **Generar cliente de prisma**
```bash
npx prisma generate
```

6. **Crear la base de datos**
```bash
npx prisma db push
```


## Ejecutar la aplicación
```bash
npm start
```
El servidor se iniciará en el puerto **3000** (o en el puerto definido en la variable de entorno `PORT`). Accede a la API mediante `http://localhost:3000`.

## Seeder
Para poblar la base de datos con datos de prueba, ejecuta el siguiente comando:
```bash
npm run seed
```