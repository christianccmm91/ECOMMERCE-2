# Manual de Despliegue de Proyecto Web Estático con Docker y Kubernetes

Este documento describe el proceso paso a paso para desplegar un sitio web estático (HTML, CSS, JS) utilizando Docker y Kubernetes localmente, ideal para desarrolladores que están compartiendo el proyecto mediante un repositorio Git.

---

## 📦 Requisitos Previos

1. Tener el proyecto clonado desde Git:
   ```bash
   git clone https://github.com/<usuario>/<repo>.git
   cd <repo>
   ```

2. Haber instalado en tu máquina:
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
     - Habilita **WSL2** y **Kubernetes** desde la configuración
   - `kubectl` (ya viene incluido con Docker Desktop)

3. Verifica que todo está listo:
   ```bash
   docker --version
   kubectl version --client
   ```

---

## 🐳 Paso 1: Construcción de Imagen Docker

Desde la raíz del proyecto (donde está el `Dockerfile`), ejecuta:

```bash
docker build -t ecommerce-web:local .
```

Esto creará una imagen Docker llamada `ecommerce-web:local`.

---

## ☸️ Paso 2: Despliegue en Kubernetes

Aplica los manifiestos contenidos en la carpeta `k8s/`:

```bash
kubectl apply -f k8s/
```

---

## 📍 Paso 3: Verifica el despliegue

1. Verifica que el pod esté corriendo:

   ```bash
   kubectl get pods
   ```

2. Verifica el puerto asignado por el servicio:

   ```bash
   kubectl get svc
   ```

   Verás algo así:

   ```
   NAME                    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
   ecommerce-web-service   NodePort   10.96.97.27     <none>        80:31439/TCP   2m
   ```

---

## 🌐 Paso 4: Accede a la aplicación

Abre tu navegador y visita:

```
http://localhost:<NodePort>
```

Ejemplo si `NodePort` es `31439`:

```
http://localhost:31439
```

---

## 🧹 Paso 5: Limpieza (opcional)

Si deseas eliminar el despliegue:

```bash
kubectl delete -f k8s/
docker image rm ecommerce-web:local
```

---

## ✅ Estructura esperada del proyecto

```
<repo>/
├── index.html
├── styles.css
├── script.js
├── Dockerfile
├── nginx.conf
└── k8s/
    ├── deployment.yaml
    └── service.yaml
```

---

**Autor:** Ángel  
**Última actualización:** Abril 2025
