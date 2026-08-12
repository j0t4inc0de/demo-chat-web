# Demo Chat Web: Simulador Dinámico de WhatsApp de We Are Samod

Este proyecto es un simulador interactivo y modular de agendamiento conversacional por WhatsApp. Está diseñado para servir como herramienta de ventas (pitch) para prospectar clientes en frío (B2B).

En lugar de reescribir código para cada cliente, el simulador carga dinámicamente toda la interfaz (colores, marcas, textos, flujos, precios) desde un archivo de configuración JSON basado en un parámetro de URL.

---

## 🎯 Cómo funciona la Carga Dinámica

La aplicación lee el parámetro `c` en la URL de navegación:
*   `http://demo-web.wearesamod.com/?c=huellitas_felices` ➔ Carga la demo de Peluquería Canina **Huellitas Felices v.a** (`clients/huellitas_felices.json`).
*   `http://demo-web.wearesamod.com/?c=barberia` ➔ Carga la demo de la Barbería **Talento Urbano** (`clients/barberia.json`).

Si el parámetro no coincide o está vacío, cargará por defecto `huellitas_felices`.

---

## ⚙️ Cómo agregar un nuevo cliente para prospectar

1.  Crea un archivo JSON en `src/clients/nombre_del_cliente.json`.
2.  Copia la estructura del archivo `huellitas_felices.json` o `barberia.json`.
3.  Modifica:
    *   `name` y `status`.
    *   `theme_color` (color principal del cliente).
    *   `sidebar` (los textos de venta: Problema, Solución y Rentabilidad).
    *   `prices` (precios estimados por tipo).
    *   `flow` (las plantillas de mensajes del chatbot y opciones).
4.  ¡Listo! Puedes probarlo al instante navegando a:
    `http://demo-web.wearesamod.com/?c=nombre_del_cliente`

---

## 🐳 Despliegue en jota-server (Docker)

El contenedor está configurado para unirse a la red de tu proxy inverso y Cloudflare Tunnel (`proxy_network`).

### 1. Iniciar el Contenedor
Estando en el directorio del proyecto en tu servidor (`~/projects/demo-chat-web`):
```bash
docker compose up -d --build
```
Esto creará y levantará el contenedor en el puerto interno `80` (expuesto también en el puerto local `8080` de tu host por si deseas testear directamente en tu red hogareña).

### 2. Exponer Subdominio en Cloudflare Zero Trust
Para asociarle el subdominio `demo-web.wearesamod.com`:

1.  Ve a tu panel de **Cloudflare Zero Trust** ➔ **Access** ➔ **Tunnels**.
2.  Edita tu túnel **`jota-server-tunnel`**.
3.  Pestaña **Public Hostname** ➔ **Add a public hostname**.
4.  Rellena los campos:
    *   **Subdomain:** `demo-web`
    *   **Domain:** `wearesamod.com`
    *   **Service Type:** `HTTP`
    *   **URL:** `demo-chat-web:80`
5.  Haz clic en **Save hostname**.

¡Tu simulador ya estará en vivo y con SSL automático en: **`https://demo-web.wearesamod.com`**!
