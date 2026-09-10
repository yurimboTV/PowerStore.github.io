const productosBase = [
    {
        id: 1,
        nombre: "Whey Protein 1 Kg",
        precio: 45000,
        categoria: "Proteinas",
        descripcion:
            "Proteína de suero de leche ideal para acompañar la recuperación y el crecimiento muscular.",
        imagen: "img/productos/whey.jpg",
        destacado: true,
        stock: 10
    },

    {
        id: 2,
        nombre: "Creatina Monohidratada 300 g",
        precio: 22000,
        categoria: "Creatina",
        descripcion:
            "Creatina monohidratada para complementar entrenamientos de fuerza y potencia.",
        imagen: "img/productos/creatina.jpg",
        destacado: true,
        stock: 10
    },

    {
        id: 3,
        nombre: "Pre-Workout Extreme",
        precio: 28000,
        categoria: "Pre-entreno",
        descripcion:
            "Suplemento pre-entrenamiento pensado para acompañar sesiones intensas.",
        imagen: "img/productos/pre-entreno.jpg",
        destacado: true,
        stock: 10
    },

    {
        id: 4,
        nombre: "Multivitamínico",
        precio: 16000,
        categoria: "Vitaminas",
        descripcion:
            "Complemento de vitaminas y minerales para acompañar una alimentación equilibrada.",
        imagen: "img/productos/multivitaminico.jpg",
        destacado: true,
        stock: 10
    },

    {
        id: 5,
        nombre: "Whey Protein 500 g",
        precio: 26000,
        categoria: "Proteinas",
        descripcion:
            "Formato compacto de proteína de suero de leche.",
        imagen: "img/productos/whey-500.jpg",
        destacado: false,
        stock: 10
    },

    {
        id: 6,
        nombre: "Creatina Micronizada 500 g",
        precio: 31000,
        categoria: "Creatina",
        descripcion:
            "Creatina micronizada para complementar tu rutina deportiva.",
        imagen: "img/productos/creatina-500.jpg",
        destacado: false,
        stock: 10
    },

    {
        id: 7,
        nombre: "Proteína Whey Premium",
        precio: 52000,
        categoria: "Proteinas",
        descripcion:
            "Proteína de alta concentración para deportistas.",
        imagen: "img/productos/whey-premium.jpg",
        destacado: false,
        stock: 10
    },

    {
        id: 8,
        nombre: "BCAA 300 g",
        precio: 19000,
        categoria: "Recuperacion",
        descripcion:
            "Suplemento de aminoácidos de cadena ramificada.",
        imagen: "img/productos/bcaa.jpg",
        destacado: false,
        stock: 10
    }
];


/* =====================================================
   OBTENER TODOS LOS PRODUCTOS
===================================================== */

function obtenerProductos() {

    const productosGuardados =
        JSON.parse(
            localStorage.getItem("productos")
        ) || [];

    return [
        ...productosBase,
        ...productosGuardados
    ];
}