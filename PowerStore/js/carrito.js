function obtenerProductoActualizado(id) {
    return obtenerProductos().find(
        producto =>
            producto.id === id
    );
}


function mostrarCarrito() {

    const contenedor =
        document.getElementById(
            "cart-container"
        );

    if (!contenedor) {
        return;
    }

    let carrito =
        obtenerCarrito();

    if (carrito.length === 0) {

        mostrarCarritoVacio(
            contenedor
        );

        return;
    }


    let total = 0;


    const productosHTML =
        carrito
            .map(item => {

                const producto =
                    obtenerProductoActualizado(
                        item.id
                    );

                if (!producto) {
                    return "";
                }


                const stock =
                    Number(
                        producto.stock ?? 0
                    );


                // Si por alguna razón
                // el carrito tiene más unidades
                // que el stock disponible,
                // corregimos la cantidad.

                if (
                    item.cantidad >
                    stock
                ) {
                    item.cantidad =
                        stock;
                }


                const subtotal =
                    producto.precio *
                    item.cantidad;


                total += subtotal;


                return `
                    <article class="cart-item">

                        <div class="cart-item-image">

                            ${
                                producto.imagen
                                ?
                                `
                                    <img
                                        src="${producto.imagen}"
                                        alt="${producto.nombre}"
                                    >
                                `
                                :
                                `
                                    <span>
                                        💪
                                    </span>
                                `
                            }

                        </div>


                        <div class="cart-item-info">

                            <span class="product-category">
                                ${producto.categoria}
                            </span>

                            <h2>
                                ${producto.nombre}
                            </h2>

                            <p>
                                ${formatearPrecio(
                                    producto.precio
                                )} por unidad
                            </p>

                        </div>


                        <div class="cart-item-quantity">

                            <span>
                                Cantidad
                            </span>

                            <div class="quantity-selector">

                                <button
                                    type="button"
                                    onclick="
                                        cambiarCantidadCarrito(
                                            ${item.id},
                                            -1
                                        )
                                    "
                                >
                                    −
                                </button>

                                <strong>
                                    ${item.cantidad}
                                </strong>

                                <button
                                    type="button"
                                    onclick="
                                        cambiarCantidadCarrito(
                                            ${item.id},
                                            1
                                        )
                                    "
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <div class="cart-item-subtotal">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${formatearPrecio(
                                    subtotal
                                )}
                            </strong>

                        </div>


                        <button
                            type="button"
                            class="cart-remove"
                            onclick="
                                eliminarDelCarrito(
                                    ${item.id}
                                )
                            "
                        >
                            🗑️
                        </button>

                    </article>
                `;

            })
            .join("");


    // Guardamos cualquier corrección
    // de cantidad producida por el stock.

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    contenedor.innerHTML = `

        <div class="cart-layout">


            <section class="cart-products">

                <div class="cart-products-header">

                    <h2>
                        Productos
                    </h2>

                    <span>
                        ${carrito.length}
                        ${
                            carrito.length === 1
                            ? "producto"
                            : "productos"
                        }
                    </span>

                </div>


                <div class="cart-items">

                    ${productosHTML}

                </div>


                <div class="cart-actions">

                    <a
                        href="productos.html"
                        class="button button-secondary"
                    >
                        ← Seguir comprando
                    </a>

                    <button
                        type="button"
                        class="cart-clear-button"
                        onclick="vaciarCarrito()"
                    >
                        Vaciar carrito
                    </button>

                </div>

            </section>


            <aside class="cart-summary">

                <h2>
                    Resumen
                </h2>


                <div class="cart-summary-row">

                    <span>
                        Productos
                    </span>

                    <strong>
                        ${formatearPrecio(total)}
                    </strong>

                </div>


                <div class="cart-summary-row">

                    <span>
                        Envío
                    </span>

                    <span>
                        A coordinar
                    </span>

                </div>


                <div class="cart-summary-divider"></div>


                <div class="cart-summary-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatearPrecio(total)}
                    </strong>

                </div>


                <button
                    type="button"
                    class="cart-checkout-button"
                    onclick="continuarCompra()"
                >
                    Continuar compra →
                </button>


                <p class="cart-summary-note">
                    El método de pago y envío
                    se coordinarán posteriormente.
                </p>

            </aside>


        </div>

    `;
}


function mostrarCarritoVacio(
    contenedor
) {

    contenedor.innerHTML = `

        <div class="cart-empty">

            <div class="cart-empty-icon">
                🛒
            </div>

            <h2>
                Tu carrito está vacío
            </h2>

            <p>
                Todavía no agregaste ningún producto.
            </p>

            <a
                href="productos.html"
                class="button button-primary"
            >
                Ver productos
            </a>

        </div>

    `;
}


function cambiarCantidadCarrito(
    id,
    cambio
) {

    let carrito =
        obtenerCarrito();


    const item =
        carrito.find(
            producto =>
                producto.id === id
        );


    if (!item) {
        return;
    }


    const producto =
        obtenerProductoActualizado(
            id
        );


    if (!producto) {
        return;
    }


    const stock =
        Number(
            producto.stock ?? 0
        );


    const nuevaCantidad =
        item.cantidad +
        cambio;


    if (nuevaCantidad <= 0) {

        eliminarDelCarrito(id);

        return;
    }


    if (
        nuevaCantidad >
        stock
    ) {

        mostrarNotificacion(
            "No hay más unidades disponibles"
        );

        return;
    }


    item.cantidad =
        nuevaCantidad;


    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    actualizarContadorCarrito();

    mostrarCarrito();
}


function eliminarDelCarrito(
    id
) {

    let carrito =
        obtenerCarrito();


    const producto =
        carrito.find(
            item =>
                item.id === id
        );


    carrito =
        carrito.filter(
            item =>
                item.id !== id
        );


    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    actualizarContadorCarrito();

    mostrarCarrito();


    if (producto) {

        mostrarNotificacion(
            `${producto.nombre} eliminado del carrito`
        );

    }
}


function vaciarCarrito() {

    const carrito =
        obtenerCarrito();


    if (
        carrito.length === 0
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Seguro que querés vaciar el carrito?"
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        "carrito"
    );


    actualizarContadorCarrito();

    mostrarCarrito();


    mostrarNotificacion(
        "Carrito vaciado"
    );
}


function continuarCompra() {

    const carrito =
        obtenerCarrito();


    if (
        carrito.length === 0
    ) {

        mostrarNotificacion(
            "El carrito está vacío"
        );

        return;
    }


    alert(
        "La compra todavía no está disponible. Próximamente agregaremos el sistema de pedidos y pagos."
    );
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        mostrarCarrito();

        actualizarContadorCarrito();

    }
);