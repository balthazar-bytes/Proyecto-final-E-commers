

// 1. SELECCIÓN DE ELEMENTOS
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


// 2. CARRITO — abrir / cerrar
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

// Estado inicial del carrito (vacío)
carritoVacio.classList.add('carrito__vacio--visible');
carritoFooter.classList.add('carrito__footer--hidden');


// 3. MENÚ HAMBURGUESA (mobile)
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


// 4. FORMULARIO DE CONTACTO

// --- 4a. Validación de campos ---
function validarCampo(inputId, errorId, validacion) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const grupo = input.closest('.form-group');

    if (!validacion(input.value.trim())) {
        input.classList.add('form-input--error');
        return false;
    } else {
        input.classList.remove('form-input--error');
        error.textContent = '';
        return true;
    }
}

function mostrarError(inputId, errorId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.add('form-input--error');
    error.textContent = mensaje;
}

function limpiarError(input) {
    input.classList.remove('form-input--error');
    const errorId = 'error-' + input.id;
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = '';
}

// Limpiar error al escribir
formContacto.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => limpiarError(input));
});

// --- 4b. Envío del formulario ---
formContacto.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevenimos el envío tradicional (no recarga la página)

    // Obtenemos los valores
    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    // Regex para validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validamos cada campo y acumulamos si hay errores
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

    // Si hay errores, nos detenemos acá
    if (hayErrores) return;

    // --- Envío a Formspree via fetch ---
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
        const respuesta = await fetch(formContacto.action, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(formContacto)
        });

        if (respuesta.ok) {
            // Éxito: mostramos mensaje, reseteamos el form y volvemos arriba
            formFeedback.textContent = '✅ ¡Mensaje enviado! Te respondemos a la brevedad.';
            formFeedback.className = 'form-feedback form-feedback--success';
            formContacto.reset();

            // Esperamos 1.5 segundos y volvemos al inicio de la página
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);

        } else {
            throw new Error('Error en la respuesta del servidor');
        }

    } catch (error) {
        // Error: mostramos mensaje de fallo
        formFeedback.textContent = '❌ Hubo un error al enviar el mensaje. Intentá de nuevo.';
        formFeedback.className = 'form-feedback form-feedback--error';

    } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar mensaje';
    }
});






