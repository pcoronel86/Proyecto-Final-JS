const listaProductos = document.getElementById("grid")
let productList = new Array();
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const URLJSONCOMPRA = "ejemplocompra.json"

//creamos productos en el html
const URLJSON = "productos.json"
$.getJSON(URLJSON, function (respuesta, estado){
    if (estado === "success"){
        let misDatos = respuesta;
        for(const dato of misDatos){
            
            productList.push({
                Id: dato.id,
                Nombre : dato.nombre,
                Imagen : dato.img,
                Precio : dato.precio,
                Cantidad : 1
            });
        }
        if(misDatos.length > 0){
            actualizarList();
        }
    }
} )

function actualizarList(){
    if(productList.length > 0 ){
        for(let i in productList){
            $(".grid").prepend(`
            <div class="producto">
                        <h5 class="productoNombre">${productList[i].Nombre}</h5>
                        <img class="imgProducto" src="${productList[i].Imagen}"  alt="...">
                        <div class="productoCompra">
                        <button id="${productList[i].Id}"class="btn btn-success ml-auto comprarButton" type="button" data-toggle="modal"
                        data-target="#comprarModal">Comprar</button>
                            <p class="precio">${productList[i].Precio}</p>
                        </div>
                        <p class="productoId">${productList[i].Id}</p>
                    </div>
            `)
        }
    }
}

/*$.getJSON(URLJSONCOMPRA, function (respuesta, estado){
    if (estado === "success"){
        console.log('----------//////////// ');
        let clienteCompras = respuesta;
        for(let i in clienteCompras){
            console.log('apellido: ' + clienteCompras[i].apellido);
            console.log('nombre: ' + clienteCompras[i].nombre);
            console.log('total: ' + clienteCompras[i].total);
            for(let j in clienteCompras[i].carrito_cliente){
                console.log('nombre producto: ' + clienteCompras[i].carrito_cliente[j].nombre);

            }
        }
    }
} )*/
// agregarAlCarrito recibe el evento de click
if (listaProductos){ listaProductos.addEventListener("click",agregarAlCarrito);}

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
    //Comprobamos Cantidad de productos
    let existeProducto = false;
    if(carrito.length > 0){
        for(let i in carrito){
            console.log('carrito[i].id: '+ carrito[i].id);
            if(carrito[i].id == productoCard.querySelector(".productoId").textContent){
                carrito[i].cantidad += 1;
                existeProducto = true;
            }
        }
    }
    if(!existeProducto){
        const datosProducto = {
            nombre: productoCard.querySelector(".productoNombre").textContent,
            precio: productoCard.querySelector(".precio").textContent,
            img: productoCard.querySelector(".imgProducto").src,
            id: productoCard.querySelector(".productoId").textContent,
            cantidad: 1
        };        
        carrito.push(datosProducto);
    }


    // let clienteCompra = {
    //     Apellido : Coronel,
    //     Nombre : Pablo,
    //     TotalCompra : subtotal,
    //     carritoFinal : carrito
    // };

    // for(let i in clienteCompras){
    //     console.log('nombre: ' + clienteCompras[i].nombre);
    //     for(let j in clienteCompras[i].carrito_cliente){
    //         console.log('nombre producto: ' + clienteCompras[i].carrito_cliente[j].nombre);

    //     }
    // }

    //nombre: Pablo
    // nombre producto: Msi A320M PRO VH
    // nombre producto: Amd Ryzen 7 5800X 4.7 Ghz

    guardarStorage();
    
}

// Gardamos en el Local storage
function guardarStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

// Creamos el Carrito

let contenedorCarrito = document.querySelector("#carrito");
if(localStorage.length >= 1){renderizarCarrito()}

////creamos productos a comprar en el html del carrito junto con el precio total

function renderizarCarrito(){
    let subtotal = 0;
    limpiarCarrito()
    console.log('ingresa a renderizarCarrito');
    carrito.forEach(producto => {
        let precioItem = parseInt(producto.precio);
        let cantidadItem = parseInt(producto.cantidad);
        console.log('precioItem: ' + precioItem);
        console.log('cantidadItem: '+cantidadItem);
        let totalItem = (precioItem * cantidadItem);
        subtotal += totalItem;

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
                        value="${producto.cantidad}">
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
    $('#total').val(subtotal);
    console.log('subtotal: '+subtotal);
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
            if(carrito[i].cantidad > 1)
                carrito[i].cantidad -=1;            
            else 
                carrito.splice(i, 1);
            
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


