# ShopNow — Proyecto Final Front-End JS

## Descripción

**ShopNow** es una tienda e-commerce desarrollada como proyecto final del curso de Front-End con JavaScript. Permite explorar productos reales obtenidos desde una API REST, agregarlos a un carrito de compras persistente y enviar consultas a través de un formulario de contacto.

## Tecnologías utilizadas

- **HTML5** semántico (`header`, `nav`, `main`, `section`, `footer`)
- **CSS3** — Flexbox, Grid, Variables CSS, Media Queries
- **Google Fonts** — Inter + Outfit
- **JavaScript** — DOM, Fetch API, localStorage
- **API** — [FakeStoreAPI](https://fakestoreapi.com)
- **Formulario** — [Formspree](https://formspree.io)

## Funcionalidades

- ✅ Fetch a la API de FakeStoreAPI (productos con imagen, título y precio)
- ✅ Filtros de productos por categoría
- ✅ Carrito de compras con `localStorage` (persiste al recargar)
- ✅ Agregar productos al carrito
- ✅ Editar cantidad (+/-) y eliminar productos
- ✅ Total dinámico actualizado en tiempo real
- ✅ Contador dinámico en el header
- ✅ Formulario de contacto con validación en JS y envío por Formspree
- ✅ Diseño responsivo (mobile, tablet, desktop)
- ✅ Buenas prácticas de accesibilidad y SEO

## Estructura del proyecto

```
Proyecto-final-E-commers/
├── index.html
├── script.js
├── README.md
└── css/
    └── styles.css
```

## Cómo usar

1. Abrí el archivo `index.html` en tu navegador.
2. Los productos se cargan automáticamente desde la API.
3. Usá los filtros para explorar por categoría.
4. Hacé clic en **+ Agregar** para sumar productos al carrito.
5. Abrí el carrito con el ícono 🛒 del header.
6. Modificá cantidades o eliminá productos desde el carrito.
7. Completá el formulario de Contacto para enviar consultas.

