/* =====================================================
   FORMATEAR PRECIO
===================================================== */

function formatearPrecio(precio) {

    return new Intl.NumberFormat("es-AR", {

        style: "currency",

        currency: "ARS",

        maximumFractionDigits: 0

    }).format(precio);

}



/* =====================================================
   OBTENER CARRITO
===================================================== */

function obtenerCarrito() {

    const carrito =
        localStorage.getItem("carrito");

    if (!carrito) {

        return [];

    }

    return JSON.parse(carrito);

}



/* =====================================================
   ACTUALIZAR CONTADOR
===================================================== */

function actualizarContadorCarrito() {

    const carrito =
        obtenerCarrito();

    const cantidad =
        carrito.reduce(

            (total, producto) =>
                total + producto.cantidad,

            0

        );


    const contador =
        document.getElementById("cart-count");


    if (contador) {

        contador.textContent =
            cantidad;

    }

}



/* =====================================================
   AGREGAR AL CARRITO
===================================================== */

function agregarAlCarrito(id) {

    let carrito =
        obtenerCarrito();


    const producto =
        obtenerProductos().find(

            producto =>
                producto.id === id

        );


    if (!producto) {

        return;

    }


    const productoExistente =
        carrito.find(

            item =>
                item.id === id

        );


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            precio: producto.precio,

            imagen: producto.imagen,

            cantidad: 1

        });

    }


    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );


    actualizarContadorCarrito();


    mostrarNotificacion(

        `${producto.nombre} agregado al carrito`

    );

}



/* =====================================================
   NOTIFICACIÓN
===================================================== */

function mostrarNotificacion(mensaje) {

    const notificacion =
        document.createElement("div");


    notificacion.textContent =
        mensaje;


    notificacion.className =
        "notification";


    document.body.appendChild(
        notificacion
    );


    setTimeout(() => {

        notificacion.classList.add(
            "notification-hide"
        );

    }, 2000);


    setTimeout(() => {

        notificacion.remove();

    }, 2500);

}



/* =====================================================
   TARJETA DE PRODUCTO
===================================================== */

function crearTarjetaProducto(producto) {

    return `

        <article class="product-card">

            <a
                href="producto.html?id=${producto.id}"
            >

                <div class="product-image">

                    <span>
                        💪
                    </span>

                </div>

            </a>


            <div class="product-info">

                <span class="product-category">

                    ${producto.categoria}

                </span>


                <h3 class="product-name">

                    ${producto.nombre}

                </h3>


                <div class="product-price">

                    ${formatearPrecio(
                        producto.precio
                    )}

                </div>


                <button

                    class="add-cart"

                    onclick="
                        agregarAlCarrito(
                            ${producto.id}
                        )
                    "

                >

                    Agregar al carrito

                </button>

            </div>

        </article>

    `;

}



/* =====================================================
   PRODUCTOS DESTACADOS
===================================================== */

function mostrarDestacados() {

    const contenedor =
        document.getElementById(
            "featured-products"
        );


    if (!contenedor) {

        return;

    }


    const destacados =
        obtenerProductos().filter(

            producto =>
                producto.destacado

        );


    contenedor.innerHTML =

        destacados

            .map(
                crearTarjetaProducto
            )

            .join("");

}



/* =====================================================
   CATÁLOGO
===================================================== */

function mostrarCatalogo() {

    const contenedor =
        document.getElementById(
            "catalog-products"
        );


    if (!contenedor) {

        return;

    }


    /*
       IMPORTANTE:

       Antes utilizábamos directamente:

           [...productos]

       Ahora usamos obtenerProductos()
       para incluir tanto los productos base
       como los agregados desde el panel admin.
    */

    let resultados =
        [...obtenerProductos()];


    /* ================= BUSCAR ================= */

    const buscador =
        document.getElementById(
            "search-input"
        );


    const texto =
        buscador
            ? buscador.value.toLowerCase().trim()
            : "";


    if (texto !== "") {

        resultados =
            resultados.filter(

                producto =>

                    producto.nombre
                        .toLowerCase()
                        .includes(texto)

                    ||

                    producto.categoria
                        .toLowerCase()
                        .includes(texto)

            );

    }



    /* ================= CATEGORÍA ================= */

    const filtroCategoria =
        document.getElementById(
            "category-filter"
        );


    const categoria =
        filtroCategoria
            ? filtroCategoria.value
            : "Todos";


    if (categoria !== "Todos") {

        resultados =
            resultados.filter(

                producto =>
                    producto.categoria ===
                    categoria

            );

    }



    /* ================= ORDEN ================= */

    const filtroOrden =
        document.getElementById(
            "sort-filter"
        );


    const orden =
        filtroOrden
            ? filtroOrden.value
            : "default";


    if (orden === "price-low") {

        resultados.sort(

            (a, b) =>
                a.precio - b.precio

        );

    }


    if (orden === "price-high") {

        resultados.sort(

            (a, b) =>
                b.precio - a.precio

        );

    }


    if (orden === "name") {

        resultados.sort(

            (a, b) =>
                a.nombre.localeCompare(
                    b.nombre
                )

        );

    }



    /* ================= MOSTRAR ================= */

    contenedor.innerHTML =

        resultados

            .map(
                crearTarjetaProducto
            )

            .join("");


    /* ================= CONTADOR ================= */

    const contador =
        document.getElementById(
            "product-count"
        );


    if (contador) {

        contador.textContent =

            `${resultados.length} ${
                resultados.length === 1
                    ? "producto"
                    : "productos"
            }`;

    }



    /* ================= SIN RESULTADOS ================= */

    const mensaje =
        document.getElementById(
            "no-results"
        );


    if (mensaje) {

        mensaje.hidden =
            resultados.length !== 0;

    }

}



/* =====================================================
   LIMPIAR FILTROS
===================================================== */

function limpiarFiltros() {

    const buscador =
        document.getElementById(
            "search-input"
        );


    const categoria =
        document.getElementById(
            "category-filter"
        );


    const orden =
        document.getElementById(
            "sort-filter"
        );


    if (buscador) {

        buscador.value = "";

    }


    if (categoria) {

        categoria.value = "Todos";

    }


    if (orden) {

        orden.value = "default";

    }


    mostrarCatalogo();

}



/* =====================================================
   LEER CATEGORÍA DESDE LA URL
===================================================== */

function cargarCategoriaDesdeURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const categoria =
        parametros.get(
            "categoria"
        );


    if (!categoria) {

        return;

    }


    const filtro =
        document.getElementById(
            "category-filter"
        );


    if (!filtro) {

        return;

    }


    const opcionExiste =
        [...filtro.options].some(

            opcion =>
                opcion.value === categoria

        );


    if (opcionExiste) {

        filtro.value =
            categoria;

    }

}



/* =====================================================
   EVENTOS DEL CATÁLOGO
===================================================== */

function iniciarCatalogo() {

    const buscador =
        document.getElementById(
            "search-input"
        );


    const categoria =
        document.getElementById(
            "category-filter"
        );


    const orden =
        document.getElementById(
            "sort-filter"
        );


    const limpiar =
        document.getElementById(
            "clear-filters"
        );


    const limpiarVacio =
        document.getElementById(
            "clear-filters-empty"
        );


    /*
       Esta página puede no tener catálogo.

       Por ejemplo, index.html no tiene
       search-input.

       Por eso simplemente salimos.
    */

    if (!buscador) {

        return;

    }


    buscador.addEventListener(

        "input",

        mostrarCatalogo

    );


    if (categoria) {

        categoria.addEventListener(

            "change",

            mostrarCatalogo

        );

    }


    if (orden) {

        orden.addEventListener(

            "change",

            mostrarCatalogo

        );

    }


    if (limpiar) {

        limpiar.addEventListener(

            "click",

            limpiarFiltros

        );

    }


    if (limpiarVacio) {

        limpiarVacio.addEventListener(

            "click",

            limpiarFiltros

        );

    }


    cargarCategoriaDesdeURL();

    mostrarCatalogo();

}



/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        mostrarDestacados();

        actualizarContadorCarrito();

        iniciarCatalogo();

    }

);