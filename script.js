// ============================================================
// SHOPNOW — script.js
// ============================================================


// ============================================================
// 1. SELECCIÓN DE ELEMENTOS
// ============================================================
const btnAbrirCarrito  = document.getElementById('btn-abrir-carrito');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
const carritoSidebar   = document.getElementById('carrito-sidebar');
const overlay          = document.getElementById('overlay');
const carritoVacio     = document.getElementById('carrito-vacio');
const carritoFooter    = document.getElementById('carrito-footer');
const btnMenu          = document.getElementById('btn-menu');
const mainNav          = document.getElementById('main-nav');
const formContacto     = document.getElementById('form-contacto');
const btnEnviar        = document.getElementById('btn-enviar');
const formFeedback     = document.getElementById('form-feedback');
const gridProductos    = document.getElementById('grid-productos');
const loadingProductos = document.getElementById('loading-productos');
const contadorCarrito  = document.getElementById('contador-carrito');
const carritoItemsEl   = document.getElementById('carrito-items');
const carritoTotalEl   = document.getElementById('carrito-total');


// ============================================================
// 2. VARIABLES GLOBALES
// ============================================================
let productos = [];
let carrito   = JSON.parse(localStorage.getItem('shopnow-carrito')) || [];


// ============================================================
// 3. CARRITO — abrir / cerrar
// ============================================================
function abrirCarrito() {
    carritoSidebar.classList.add('carrito-sidebar--abierto');
    overlay.classList.add('overlay--visible');
    carritoSidebar.setAttribute('aria-hidden', 'false');
}

function cerrarCarrito() {
    carritoSidebar.classList.remove('carrito-sidebar--abierto');
    overlay.classList.remove('overlay--visible');
    carritoSidebar.setAttribute('aria-hidden', 'true');
}

btnAbrirCarrito.addEventListener('click', abrirCarrito);
btnCerrarCarrito.addEventListener('click', cerrarCarrito);
overlay.addEventListener('click', cerrarCarrito);


// ============================================================
// 4. MENÚ HAMBURGUESA (mobile)
// ============================================================
btnMenu.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('header__nav--open');
    btnMenu.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('header__nav--open');
        btnMenu.setAttribute('aria-expanded', 'false');
    });
});


// ============================================================
// 5. FORMULARIO DE CONTACTO
// ============================================================

function mostrarError(inputId, errorId, mensaje) {
    document.getElementById(inputId).classList.add('form-input--error');
    document.getElementById(errorId).textContent = mensaje;
}

function limpiarError(input) {
    input.classList.remove('form-input--error');
    const errorEl = document.getElementById('error-' + input.id);
    if (errorEl) errorEl.textContent = '';
}

// Limpiar errores mientras el usuario escribe
formContacto.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => limpiarError(input));
});

formContacto.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let hayErrores = false;

    if (nombre === '') {
        mostrarError('nombre', 'error-nombre', 'El nombre es obligatorio.');
        hayErrores = true;
    }
    if (email === '') {
        mostrarError('email', 'error-email', 'El correo electrónico es obligatorio.');
        hayErrores = true;
    } else if (!regexEmail.test(email)) {
        mostrarError('email', 'error-email', 'Ingresá un correo electrónico válido.');
        hayErrores = true;
    }
    if (mensaje === '') {
        mostrarError('mensaje', 'error-mensaje', 'El mensaje es obligatorio.');
        hayErrores = true;
    }

    if (hayErrores) return;

    btnEnviar.disabled    = true;
    btnEnviar.textContent = 'Enviando...';

    try {
        const respuesta = await fetch(formContacto.action, {
            method:  'POST',
            headers: { 'Accept': 'application/json' },
            body:    new FormData(formContacto)
        });

        if (respuesta.ok) {
            formFeedback.textContent = '✅ ¡Mensaje enviado! Te respondemos a la brevedad.';
            formFeedback.className   = 'form-feedback form-feedback--success';
            formContacto.reset();
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 1500);
        } else {
            throw new Error('Error del servidor');
        }
    } catch {
        formFeedback.textContent = '❌ Hubo un error al enviar. Intentá de nuevo.';
        formFeedback.className   = 'form-feedback form-feedback--error';
    } finally {
        btnEnviar.disabled    = false;
        btnEnviar.textContent = 'Enviar mensaje';
    }
});


// ============================================================
// 6. FETCH — Obtener productos de la API
// ============================================================
async function obtenerProductos() {
    try {
        const respuesta = await fetch('https://fakestoreapi.com/products');
        const datos     = await respuesta.json();

        productos = datos;
        loadingProductos.classList.add('loading--hidden');
        renderizarProductos(productos);
    } catch (err) {
        loadingProductos.innerHTML = '<p>❌ Error al cargar los productos. Recargá la página.</p>';
        console.error(err);
    }
}


// ============================================================
// 7. RENDERIZAR PRODUCTOS en la grilla (Flexbox)
// ============================================================
function renderizarProductos(lista) {
    gridProductos.innerHTML = '';

    if (lista.length === 0) {
        gridProductos.innerHTML = '<p style="color:var(--color-text-muted); text-align:center; width:100%">No se encontraron productos en esta categoría.</p>';
        return;
    }

    lista.forEach(producto => {
        const estrellas = '⭐'.repeat(Math.round(producto.rating.rate));

        const card = document.createElement('div');
        card.classList.add('producto-card');
        card.setAttribute('role', 'listitem');

        card.innerHTML = `
            <div class="producto-card__img-wrapper">
                <img
                    src="${producto.image}"
                    alt="${producto.title}"
                    class="producto-card__img"
                    loading="lazy"
                >
            </div>
            <div class="producto-card__body">
                <span class="producto-card__categoria">${producto.category}</span>
                <h3 class="producto-card__nombre">${producto.title}</h3>
                <p class="producto-card__estrellas" aria-label="Puntuación: ${producto.rating.rate} de 5">
                    ${estrellas} (${producto.rating.count})
                </p>
            </div>
            <div class="producto-card__footer">
                <span class="producto-card__precio">$${producto.price.toFixed(2)}</span>
                <button
                    class="producto-card__btn"
                    onclick="agregarAlCarrito(${producto.id})"
                    aria-label="Agregar ${producto.title} al carrito"
                >
                    + Agregar
                </button>
            </div>
        `;

        gridProductos.appendChild(card);
    });
}


// ============================================================
// 8. FILTROS DE CATEGORÍA
// ============================================================
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Marcar botón activo
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('filtro-btn--active'));
        btn.classList.add('filtro-btn--active');

        const categoria = btn.dataset.categoria;

        if (categoria === 'all') {
            renderizarProductos(productos);
        } else {
            const filtrados = productos.filter(p => p.category === categoria);
            renderizarProductos(filtrados);
        }
    });
});


// ============================================================
// 9. CARRITO — Lógica completa
// ============================================================

// --- 9a. Agregar al carrito ---
function agregarAlCarrito(id) {
    // Buscamos el producto en el array global
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    // ¿Ya está en el carrito?
    const yaExiste = carrito.find(item => item.id === id);

    if (yaExiste) {
        yaExiste.cantidad += 1;       // si ya existe, sumamos 1
    } else {
        carrito.push({ ...producto, cantidad: 1 }); // si no, lo agregamos
    }

    guardarCarrito();
    renderizarCarrito();
    actualizarContador();

    // Abrimos el carrito para que el usuario lo vea
    abrirCarrito();
}

// --- 9b. Cambiar cantidad (+1 o -1) ---
function cambiarCantidad(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += delta;

    // Si la cantidad llega a 0, eliminamos el producto
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    guardarCarrito();
    renderizarCarrito();
    actualizarContador();
}

// --- 9c. Eliminar producto del carrito ---
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
    actualizarContador();
}

// --- 9d. Guardar en localStorage ---
function guardarCarrito() {
    localStorage.setItem('shopnow-carrito', JSON.stringify(carrito));
}

// --- 9e. Actualizar contador del badge en el header ---
function actualizarContador() {
    const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    contadorCarrito.textContent = total;

    // Animación del badge
    contadorCarrito.classList.remove('cart-badge--pulse');
    void contadorCarrito.offsetWidth; // fuerza reflow para reiniciar animación
    contadorCarrito.classList.add('cart-badge--pulse');
}

// --- 9f. Calcular y mostrar total ---
function actualizarTotal() {
    const total = carrito.reduce((suma, item) => suma + item.price * item.cantidad, 0);
    carritoTotalEl.textContent = '$' + total.toFixed(2);
}

// --- 9g. Renderizar todos los items del carrito ---
function renderizarCarrito() {
    carritoItemsEl.innerHTML = '';

    if (carrito.length === 0) {
        // Carrito vacío
        carritoVacio.classList.add('carrito__vacio--visible');
        carritoFooter.classList.add('carrito__footer--hidden');
        return;
    }

    // Hay items: ocultamos el mensaje vacío y mostramos el footer
    carritoVacio.classList.remove('carrito__vacio--visible');
    carritoFooter.classList.remove('carrito__footer--hidden');

    carrito.forEach(item => {
        const subtotal = (item.price * item.cantidad).toFixed(2);

        const div = document.createElement('div');
        div.classList.add('carrito-item');
        div.setAttribute('role', 'listitem');

        div.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.title}"
                class="carrito-item__img"
            >
            <div class="carrito-item__info">
                <p class="carrito-item__nombre">${item.title}</p>
                <p class="carrito-item__precio">$${item.price.toFixed(2)} c/u</p>
            </div>
            <div class="carrito-item__controles">
                <span class="carrito-item__subtotal">$${subtotal}</span>
                <div class="carrito-item__cantidad">
                    <button
                        class="btn-cantidad"
                        onclick="cambiarCantidad(${item.id}, -1)"
                        aria-label="Disminuir cantidad de ${item.title}"
                    >−</button>
                    <span class="cantidad-numero" aria-label="Cantidad: ${item.cantidad}">${item.cantidad}</span>
                    <button
                        class="btn-cantidad"
                        onclick="cambiarCantidad(${item.id}, +1)"
                        aria-label="Aumentar cantidad de ${item.title}"
                    >+</button>
                    <button
                        class="btn-cantidad btn-cantidad--eliminar"
                        onclick="eliminarDelCarrito(${item.id})"
                        aria-label="Eliminar ${item.title} del carrito"
                    >🗑️</button>
                </div>
            </div>
        `;

        carritoItemsEl.appendChild(div);
    });

    actualizarTotal();
}


// ============================================================
// 10. BOTÓN "FINALIZAR COMPRA"
// ============================================================
document.getElementById('btn-comprar').addEventListener('click', () => {
    if (carrito.length === 0) return;

    alert('✅ ¡Gracias por tu compra! Tu pedido está siendo procesado.');

    // Vaciamos el carrito
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    actualizarContador();
    cerrarCarrito();
});


// ============================================================
// 11. ARRANQUE INICIAL
// ============================================================
obtenerProductos();   // carga productos de la API
renderizarCarrito();  // carga el carrito guardado en localStorage
actualizarContador(); // muestra el número correcto en el badge
