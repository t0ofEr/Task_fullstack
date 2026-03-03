# 🧠 Gestor de Tareas Asistido por Agente de IA

Aplicación web desarrollada con **Django + PostgreSQL + Docker**, que permite a los usuarios gestionar tareas de forma inteligente mediante un **agente de IA** que asiste en la organización, priorización y apoyo contextual.

---

## 📌 Descripción General

Este sistema permite a usuarios autenticados:

- Crear y gestionar tareas
- Organizar actividades personales o laborales
- Recibir asistencia inteligente mediante un agente de IA
- Acceder a un panel administrativo (Django Admin)

El objetivo del proyecto es demostrar la integración de un backend Django con contenedores Docker y una base de datos PostgreSQL, incorporando además asistencia automatizada basada en IA.

---

## 🚀 Tecnologías Utilizadas

- Python 3.11
- Django
- PostgreSQL
- Docker
- Docker Compose
- React

---

## 🏗️ Arquitectura

El proyecto está compuesto por:

- **Backend:** Django
- **Base de Datos:** PostgreSQL
- **Orquestación:** Docker Compose

Todos los servicios se levantan mediante contenedores.

---

# 📦 Instalación y Levantamiento del Proyecto

## 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

## Levantar contenedores:

- docker compose up --build

## Migraciones: 
 - docker compose exec backend python manage.py makemigrations
 - docker compose exec backend python manage.py migrate

## Crear Super usuario 

docker compose exec backend python manage.py createsuperuser

http://localhost:8000 (Backend)
http://localhost:3000 (Frontend)

