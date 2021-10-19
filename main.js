const listaProductos = document.getElementById("grid")

class Producto{
    constructor(nombre, precio, img, id){
        this.nombre = nombre.toUpperCase();
        this.precio = precio;
        this.img = img;
        this.id = id;
    }
    sumaIva() {
        this.precio = this.precio * 1.21;
    }
}

let productos = []

/*productos.push(new Producto("Amd Ryzen 7 3800XT 4.7 Ghz", 47500,"images/Procesador Amd Ryzen 7 3800XT 4.7 Ghz.jpeg", 1));
productos.push(new Producto("Amd Ryzen 7 5800X 4.7 Ghz", 57500, "images/Procesador Amd Ryzen 7 5800X 4.7 Ghz.jpeg", 2));
productos.push(new Producto("Amd Ryzen 7 5700G 4.6 Ghz", 56000, "images/Procesador Amd Ryzen 7 5700G 4.6 Ghz.jpeg", 3));
productos.push(new Producto("Msi A320M PRO VH", 6200, "images/Msi A320M PRO VH.jpeg", 4));
productos.push(new Producto("Msi A520M-A PRO", 7500, "images/Msi A520M-A PRO.jpeg", 5));
productos.push(new Producto("Msi X570-A PRO", 21500, "images/Msi X570-A PRO.jpeg", 6));
productos.push(new Producto("Msi B550 TOMAHAWK", 23500, "images/Msi B550 TOMAHAWK.jpeg", 7));
productos.push(new Producto("RTX 3060 Ti 8Gb Msi Gaming X", 200000, "images/RTX 3060 Ti 8Gb Msi Gaming X.jpeg", 8));
productos.push(new Producto("RTX 3060 Ti 8Gb Msi Ventus 2X Oc", 185000, "images/RTX 3060 Ti 8Gb Msi Ventus 2X Oc.jpeg", 9));
productos.push(new Producto("RTX 3080 Ti 12Gb Msi Ventus 3X Oc", 325000, "images/RTX 3080 Ti 12Gb Msi Ventus 3X Oc.jpeg", 10));
productos.push(new Producto("RTX 2060 6Gb Asus Dual Oc", 127000, "images/RTX 2060 6Gb Asus Dual Oc.jpeg", 11));*/
// Sumar IVA
for(const producto of productos)
producto.sumaIva();
console.log(productos);




let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//creamos productos en el html
const URLJSON = "productos.json"
$.getJSON(URLJSON, function (respuesta, estado){
    if (estado === "success"){
        let misDatos = respuesta;
        for(const dato of misDatos){
            $(".grid").prepend(`
            <div class="producto">
                        <h5 class="productoNombre">${dato.nombre}</h5>
                        <img class="imgProducto" src="${dato.img}"  alt="...">
                        <div class="productoCompra">
                        <button id="${dato.id}"class="btn btn-success ml-auto comprarButton" type="button" data-toggle="modal"
                        data-target="#comprarModal">Comprar</button>
                            <p class="precio">${dato.precio}</p>
                        </div>
                        <p class="productoId">${dato.id}</p>
                    </div>
            `)
        }
    }
} )


if (listaProductos){ listaProductos.addEventListener("click",agregarAlCarrito);}

// agregarAlCarrito recibe el evento de click
function agregarAlCarrito(e) {
    e.preventDefault();

    // Se localiza el click
    if (e.target.classList.contains("comprarButton")){
        let button = event.target;
        let productoCompra = button.closest(".producto");
        console.log('procucto:',productoCompra);

        //pasamos el producto a obtenerDatos()
        obtenerDatos(productoCompra)
        

    }
}
function obtenerDatos(productoCard){
    const datosProducto = {
        nombre: productoCard.querySelector(".productoNombre").textContent,
        precio: productoCard.querySelector(".precio").textContent,
        img: productoCard.querySelector(".imgProducto").src,
        id: productoCard.querySelector(".productoId").textContent
    };
    //comprobamos que se guarde correctamente
    console.log(datosProducto);
    carrito.push(datosProducto);
    guardarStorage();
    
}

// Gardamos en el Local storage
function guardarStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    console.log(carrito);
}
console.log(carrito);

// Creamos el Carrito

let contenedorCarrito = document.querySelector("#carrito");
if(localStorage.length >= 1){renderizarCarrito()}

////creamos productos a comprar en el html del carrito

function renderizarCarrito(){
    limpiarCarrito()
    carrito.forEach(producto => {
        let row = document.createElement('div');
        row.classList.add("row")
        row.innerHTML += `
        <div class="row shoppingCartItem">
            <div class="col-6">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <img src='${producto.img}' class="shopping-cart-image">
                    <h6 class="shopping-cart-item-title shoppingCartItemTitle text-light ml-3 mb-0">${producto.nombre}
                    </h6>
                    <p class="productoId">${producto.id}</p>
                </div>
            </div>
            <div class="col-2">
                <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <p class="item-price mb-0 text-light shoppingCartItemPrice">${producto.precio}</p>
                </div>
            </div>
            <div class="col-4">
                <div
                    class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                    <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                        value="${producto.cantidad}<">
                    <button class="btn btn-danger buttonDelete" type="button">X</button>
                </div>
            </div>
        </div>
        ` 
        row.querySelector('.buttonDelete').addEventListener('click',borrarItems)
        contenedorCarrito.appendChild(row)
        //evento click para borrar compra
        row.querySelector('.buttonDelete').addEventListener('click', obtenerDatoBorra)
    })
}
function limpiarCarrito(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

//obtenemos el div a borrar
function obtenerDatoBorra(event){
    let buttonclick = event.target;
    let productoBorrar = buttonclick.closest(".row");
    console.log('procuctoBorrar:',productoBorrar);   
    
    obtenerId(productoBorrar)
}

// Obtenemos el nombre del producto a borrar para pasarlo por la funcion borrarCopra
function obtenerId (procuctoBorrar){

    let itemId = procuctoBorrar.querySelector('.productoId').textContent;
    console.log('ID:',itemId);
    borrarCompra(itemId);
    console.log(carrito);

}

//La Funcio borrarCompra consiste en un for que buscar el id del producto a borrar y eliminarlo del arry carrito.
function borrarCompra(itemId){
    console.log('-------------------------------------');
    console.log(itemId);
    for(let i = 0; i < carrito.length; i ++){
        if(carrito[i].id == itemId){
            carrito.splice(i, 1)
            break;
        }
    }
    guardarStorage()
}
function borrarItems(event){
    let buttonclicked = event.target;
    buttonclicked.closest(".row").remove();
}
$(document).ready(function(){
    $('.productoId').hide();
   
});


