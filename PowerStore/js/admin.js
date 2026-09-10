const PRODUCTOS_STORAGE = "productos";


/* =====================================================
   PRODUCTOS GUARDADOS
===================================================== */

function obtenerProductosAgregados() {

    return JSON.parse(
        localStorage.getItem(PRODUCTOS_STORAGE)
    ) || [];

}


/* =====================================================
   GUARDAR PRODUCTOS
===================================================== */

function guardarProductos(productos) {

    localStorage.setItem(
        PRODUCTOS_STORAGE,
        JSON.stringify(productos)
    );

}


/* =====================================================
   TODOS LOS PRODUCTOS
===================================================== */

function obtenerTodosLosProductosAdmin() {

    return [
        ...productosBase,
        ...obtenerProductosAgregados()
    ];

}


/* =====================================================
   OBTENER ID NUEVO
===================================================== */

function obtenerNuevoId() {

    const todos =
        obtenerTodosLosProductosAdmin();


    if (todos.length === 0) {
        return 1;
    }


    return Math.max(
        ...todos.map(
            producto => producto.id
        )
    ) + 1;

}


/* =====================================================
   AGREGAR PRODUCTO
===================================================== */

function agregarProducto(event) {

    event.preventDefault();


    const nombre =
        document
            .getElementById("product-name")
            .value
            .trim();


    const precio =
        Number(
            document
                .getElementById("product-price")
                .value
        );


    const stock =
        Number(
            document
                .getElementById("product-stock")
                .value
        );


    const categoria =
        document
            .getElementById("product-category")
            .value;


    const descripcion =
        document
            .getElementById("product-description")
            .value
            .trim();


    const imagen =
        document
            .getElementById("product-image")
            .value
            .trim();


    const destacado =
        document
            .getElementById("product-featured")
            .checked;


    /* ================= VALIDAR ================= */

    if (
        !nombre ||
        precio <= 0 ||
        !categoria ||
        stock < 0
    ) {

        alert(
            "Completá correctamente los campos obligatorios."
        );

        return;
    }


    /* ================= CREAR ================= */

    const nuevoProducto = {

        id: obtenerNuevoId(),

        nombre: nombre,

        precio: precio,

        categoria: categoria,

        descripcion: descripcion,

        imagen:
            imagen ||
            "img/productos/default.jpg",

        destacado: destacado,

        stock: stock

    };


    /* ================= GUARDAR ================= */

    const productos =
        obtenerProductosAgregados();


    productos.push(
        nuevoProducto
    );


    guardarProductos(
        productos
    );


    /* ================= LIMPIAR ================= */

    document
        .getElementById("product-form")
        .reset();


    /* ================= ACTUALIZAR ================= */

    mostrarProductosAdmin();


    mostrarNotificacion(
        "Producto agregado correctamente"
    );

}


/* =====================================================
   CAMBIAR STOCK
===================================================== */

function cambiarStock(
    id,
    cantidad
) {

    const productos =
        obtenerProductosAgregados();


    const producto =
        productos.find(
            producto =>
                producto.id === id
        );


    if (!producto) {

        mostrarNotificacion(
            "Este producto no puede modificarse todavía"
        );

        return;
    }


    const nuevoStock =
        Number(producto.stock || 0)
        + cantidad;


    if (nuevoStock < 0) {
        return;
    }


    producto.stock =
        nuevoStock;


    guardarProductos(
        productos
    );


    mostrarProductosAdmin();

}


/* =====================================================
   ESTADO DEL STOCK
===================================================== */

function obtenerEstadoStock(stock) {

    stock =
        Number(stock || 0);


    if (stock <= 0) {

        return {
            texto: "Sin stock",
            clase: "stock-out"
        };

    }


    if (stock <= 3) {

        return {
            texto:
                `Últimas ${stock} unidades`,
            clase: "stock-low"
        };

    }


    return {
        texto:
            `${stock} unidades disponibles`,
        clase: "stock-available"
    };

}


/* =====================================================
   ELIMINAR PRODUCTO
===================================================== */

function eliminarProducto(id) {

    const producto =
        obtenerTodosLosProductosAdmin()
            .find(
                producto =>
                    producto.id === id
            );


    if (!producto) {
        return;
    }


    /* ================= PRODUCTO BASE ================= */

    const esProductoBase =
        productosBase.some(
            productoBase =>
                productoBase.id === id
        );


    if (esProductoBase) {

        mostrarNotificacion(
            "Los productos originales todavía no se pueden eliminar"
        );

        return;
    }


    /* ================= CONFIRMAR ================= */

    const confirmar =
        confirm(
            `¿Seguro que querés eliminar "${producto.nombre}"?`
        );


    if (!confirmar) {
        return;
    }


    let productos =
        obtenerProductosAgregados();


    productos =
        productos.filter(
            producto =>
                producto.id !== id
        );


    guardarProductos(
        productos
    );


    mostrarProductosAdmin();


    mostrarNotificacion(
        "Producto eliminado"
    );

}


/* =====================================================
   MOSTRAR PRODUCTOS
===================================================== */

function mostrarProductosAdmin() {

    const container =
        document.getElementById(
            "admin-products"
        );


    if (!container) {
        return;
    }


    const productos =
        obtenerTodosLosProductosAdmin();


    const contador =
        document.getElementById(
            "admin-product-count"
        );


    if (contador) {

        contador.textContent =
            `${productos.length} productos`;

    }


    /* ================= SIN PRODUCTOS ================= */

    if (productos.length === 0) {

        container.innerHTML = `

            <div class="admin-empty">

                <div class="admin-empty-icon">
                    📦
                </div>

                <h3>
                    Todavía no hay productos
                </h3>

                <p>
                    Usá el formulario de arriba
                    para agregar el primero.
                </p>

            </div>

        `;

        return;
    }


    /* ================= PRODUCTOS ================= */

    container.innerHTML =

        productos
            .map(producto => {

                const stock =
                    obtenerEstadoStock(
                        producto.stock
                    );


                const esBase =
                    productosBase.some(
                        productoBase =>
                            productoBase.id ===
                            producto.id
                    );


                return `

                    <div class="admin-product">


                        <!-- IMAGEN -->

                        <div class="admin-product-image">

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


                        <!-- INFORMACIÓN -->

                        <div class="admin-product-info">

                            <span
                                class="admin-product-category"
                            >
                                ${producto.categoria}
                            </span>


                            <h3>
                                ${producto.nombre}
                            </h3>


                            <strong>
                                ${formatearPrecio(
                                    producto.precio
                                )}
                            </strong>


                            <div
                                class="admin-stock ${stock.clase}"
                            >
                                ${stock.texto}
                            </div>

                        </div>


                        <!-- STOCK -->

                        <div
                            class="admin-product-stock"
                        >

                            <span>
                                Stock
                            </span>


                            <div
                                class="stock-controls"
                            >

                                <button
                                    type="button"
                                    onclick="
                                        cambiarStock(
                                            ${producto.id},
                                            -1
                                        )
                                    "
                                >
                                    −
                                </button>


                                <strong>
                                    ${producto.stock}
                                </strong>


                                <button
                                    type="button"
                                    onclick="
                                        cambiarStock(
                                            ${producto.id},
                                            1
                                        )
                                    "
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <!-- ACCIONES -->

                        <div
                            class="admin-product-actions"
                        >

                            ${
                                esBase
                                ?
                                `
                                    <span
                                        class="admin-base-label"
                                    >
                                        Producto original
                                    </span>
                                `
                                :
                                `
                                    <button
                                        type="button"
                                        class="admin-delete-button"
                                        onclick="
                                            eliminarProducto(
                                                ${producto.id}
                                            )
                                        "
                                    >
                                        🗑️ Eliminar
                                    </button>
                                `
                            }

                        </div>


                    </div>

                `;

            })
            .join("");

}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        mostrarProductosAdmin();


        actualizarContadorCarrito();


        const form =
            document.getElementById(
                "product-form"
            );


        if (form) {

            form.addEventListener(
                "submit",
                agregarProducto
            );

        }

    }
);