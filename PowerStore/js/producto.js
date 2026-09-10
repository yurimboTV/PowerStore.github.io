/* =====================================================
   OBTENER PRODUCTO DESDE LA URL
===================================================== */

function obtenerProductoDesdeURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(
            parametros.get("id")
        );


    if (!id) {

        return null;

    }


    const producto =
        obtenerProductos().find(

            producto =>
                producto.id === id

        );


    return producto || null;

}



/* =====================================================
   MOSTRAR PRODUCTO
===================================================== */

function mostrarProducto() {

    const contenedor =
        document.getElementById(
            "product-container"
        );


    if (!contenedor) {

        return;

    }


    const producto =
        obtenerProductoDesdeURL();


    /* ================= PRODUCTO NO ENCONTRADO ================= */

    if (!producto) {

        contenedor.innerHTML = `

            <div class="product-not-found">

                <h1>
                    Producto no encontrado
                </h1>

                <p>
                    El producto que estás buscando no existe.
                </p>

                <a
                    href="productos.html"
                    class="button button-primary"
                >
                    Ver productos
                </a>

            </div>

        `;

        return;

    }



    /* ================= STOCK ================= */

    const stock =
        Number(producto.stock ?? 0);


    let textoStock = "";
    let claseStock = "";


    if (stock <= 0) {

        textoStock =
            "Sin stock";

        claseStock =
            "stock-out";

    } else if (stock <= 3) {

        textoStock =
            `Últimas ${stock} unidades`;

        claseStock =
            "stock-low";

    } else {

        textoStock =
            `${stock} unidades disponibles`;

        claseStock =
            "stock-available";

    }



    /* ================= HTML ================= */

    contenedor.innerHTML = `

        <div class="back-link-container">

            <a
                href="productos.html"
                class="back-link"
            >
                ← Volver a productos
            </a>

        </div>


        <div class="product-detail-grid">


            <!-- IMAGEN -->

            <div class="product-detail-image">

                ${
                    producto.imagen
                    ? `
                        <img
                            src="${producto.imagen}"
                            alt="${producto.nombre}"
                        >
                    `
                    : `
                        <div class="product-detail-placeholder">
                            💪
                        </div>
                    `
                }

            </div>



            <!-- INFORMACIÓN -->

            <div class="product-detail-info">

                <span class="product-category">

                    ${producto.categoria}

                </span>


                <h1>

                    ${producto.nombre}

                </h1>


                <div class="product-detail-price">

                    ${formatearPrecio(
                        producto.precio
                    )}

                </div>


                <p class="product-description">

                    ${producto.descripcion}

                </p>


                <div class="product-divider"></div>


                <!-- STOCK -->

                <div class="product-stock ${claseStock}">

                    ${
                        stock > 0
                        ? "📦"
                        : "🔴"
                    }

                    ${textoStock}

                </div>


                <!-- CANTIDAD -->

                <div class="quantity-section">

                    <span>
                        Cantidad
                    </span>


                    <div class="quantity-selector">

                        <button
                            type="button"
                            id="quantity-minus"
                        >
                            −
                        </button>


                        <span id="quantity-value">
                            1
                        </span>


                        <button
                            type="button"
                            id="quantity-plus"
                        >
                            +
                        </button>

                    </div>

                </div>


                <!-- AGREGAR -->

                <button

                    id="add-product-button"

                    class="add-product-button"

                    ${
                        stock <= 0
                        ? "disabled"
                        : ""
                    }

                >

                    ${
                        stock <= 0
                        ? "Sin stock"
                        : "Agregar al carrito"
                    }

                </button>


                <a
                    href="carrito.html"
                    class="go-cart-button"
                >
                    Ver carrito →
                </a>


                <!-- INFORMACIÓN -->

                <ul class="product-info-list">

                    <li>
                        🚚 Envíos a coordinar
                    </li>

                    <li>
                        🔒 Compra segura
                    </li>

                    <li>
                        📦 Stock actualizado
                    </li>

                </ul>

            </div>

        </div>

    `;


    configurarCantidad(producto);

}



/* =====================================================
   CONFIGURAR CANTIDAD
===================================================== */

function configurarCantidad(producto) {

    const botonMenos =
        document.getElementById(
            "quantity-minus"
        );


    const botonMas =
        document.getElementById(
            "quantity-plus"
        );


    const cantidadElemento =
        document.getElementById(
            "quantity-value"
        );


    const botonAgregar =
        document.getElementById(
            "add-product-button"
        );


    let cantidad = 1;


    const stock =
        Number(producto.stock ?? 0);



    function actualizarCantidad() {

        cantidadElemento.textContent =
            cantidad;

    }



    botonMenos.addEventListener(

        "click",

        () => {

            if (cantidad > 1) {

                cantidad--;

                actualizarCantidad();

            }

        }

    );



    botonMas.addEventListener(

        "click",

        () => {

            if (cantidad < stock) {

                cantidad++;

                actualizarCantidad();

            }

        }

    );



    botonAgregar.addEventListener(

        "click",

        () => {

            if (stock <= 0) {

                return;

            }


            agregarProductoCantidad(

                producto,

                cantidad

            );

        }

    );

}



/* =====================================================
   AGREGAR CANTIDAD AL CARRITO
===================================================== */

function agregarProductoCantidad(
    producto,
    cantidad
) {

    let carrito =
        obtenerCarrito();


    const productoExistente =
        carrito.find(

            item =>
                item.id === producto.id

        );


    const stock =
        Number(producto.stock ?? 0);


    const cantidadActual =
        productoExistente
        ? productoExistente.cantidad
        : 0;


    if (
        cantidadActual + cantidad >
        stock
    ) {

        mostrarNotificacion(
            "No hay suficiente stock disponible"
        );

        return;

    }


    if (productoExistente) {

        productoExistente.cantidad +=
            cantidad;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            precio: producto.precio,

            imagen: producto.imagen,

            cantidad: cantidad

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
   PRODUCTOS RELACIONADOS
===================================================== */

function mostrarProductosRelacionados() {

    const contenedor =
        document.getElementById(
            "related-products-grid"
        );


    if (!contenedor) {

        return;

    }


    const producto =
        obtenerProductoDesdeURL();


    if (!producto) {

        return;

    }


    const relacionados =
        obtenerProductos()

            .filter(

                otroProducto =>

                    otroProducto.categoria ===
                    producto.categoria

                    &&

                    otroProducto.id !==
                    producto.id

            )

            .slice(0, 4);


    contenedor.innerHTML =

        relacionados

            .map(
                crearTarjetaProducto
            )

            .join("");

}



/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        mostrarProducto();

        mostrarProductosRelacionados();

    }

);