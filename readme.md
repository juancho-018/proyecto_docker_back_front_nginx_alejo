## Shoe Store Microservices - Docker Deployment

Este proyecto despliega una solución completa de tienda de zapatos utilizando una arquitectura de microservicios, cumpliendo con los requisitos de despliegue manual en contenedores Docker (sin docker-compose).

##  Tecnologías Utilizadas

- **Frontend**: React (Vite) + Nginx (Proxy Inverso)
- **Backend**: Node.js (Express) + Sequelize ORM
- **Base de Datos**: PostgreSQL 16
- **Contenedores**: Docker (Multi-stage build)

---

##  Guía de Despliegue Paso a Paso

Sigue estas instrucciones para levantar el ecosistema completo.

### 1. Limpieza Inicial (Opcional pero Recomendado)
Si ya tienes contenedores o volúmenes de intentos previos, bórralos para evitar conflictos de nombres:
```powershell
docker rm -f frontend-app gateway-service auth-service product-service order-service db-container
docker volume rm pg-data-shoes
```

### 2. Preparación de Redes y Volúmenes
```bash
# Crear redes obligatorias
docker network create red-back-db
docker network create red-front-back

# Crear volumen persistente
docker volume create pg-data-shoes
```

### 3. Base de Datos (PostgreSQL)
Este comando monta el script `init-db.sql` para crear las bases de datos `shoes_auth`, `shoes_products` y `shoes_orders`.

**PowerShell (Sustituye por tu ruta completa si es necesario):**
```powershell
docker run -d --name db-container --network red-back-db -p 5432:5432 -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=postgres -v pg-data-shoes:/var/lib/postgresql/data -v "${PWD}/back/gateway/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql" postgres:16-alpine
```

### 4. Construcción y Ejecución del Backend
Es vital usar el flag `--env-file` para que los servicios conecten a la base de datos.

#### A. Auth Service
```bash
docker build -t auth-img ./back/auth-service
docker run -d --name auth-service --network red-back-db --env-file ./back/auth-service/.env auth-img
```

#### B. Product Service
```bash
docker build -t product-img ./back/product-service
docker run -d --name product-service --network red-back-db --env-file ./back/product-service/.env product-img
```

#### C. Order Service
```bash
docker build -t order-img ./back/order-service
docker run -d --name order-service --network red-back-db --env-file ./back/order-service/.env order-img
```

###  5. Carga de Datos Iniciales (SEED)
**¡IMPORTANTE!** Para que la tienda tenga productos, se debe ejecutar el script de siembra una vez que el `product-service` esté corriendo:

```
docker exec -it product-service node src/seed.js
```

### 6. API Gateway y Frontend (Proxy Inverso)

#### A. API Gateway
```bash
docker build -t gateway-img ./back/gateway
docker run -d --name gateway-service --network red-back-db --env-file ./back/gateway/.env gateway-img
docker network connect red-front-back gateway-service
```

#### B. Frontend (Nginx)
```bash
docker build -t front-img ./front
docker run -d --name frontend-app --network red-front-back -p 80:80 front-img
```

---

## Verificación
- Abrir [http://localhost](http://localhost) en el navegador.
- Si todo es correcto, se verá el catálogo de zapatos Nike, Adidas y Puma cargado desde la base de datos.

---

## Estructura del Repositorio
```text
/
├── back/               # Microservicios
├── front/              # App React + Nginx Config
├── init-db.sql         # Script SQL de inicialización
└── README.md           # Estas instrucciones
```
