const listaProductos = document.getElementById("grid")
const listaDeCompra = document.getElementById("creator")
let productList = new Array();
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const URLJSON = "productos.json"
let form = document.getElementById('form');
let clienteCompra = [];

//comensamos recorriendo el .JSON para crear los objetos en producList
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

//creamos los productos en el html recorriento productList y creando un div con los datos
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

//agregamos el evento al boton comprar de los productos
if (listaProductos){ listaProductos.addEventListener("click",agregarAlCarrito);}
function agregarAlCarrito(e) {
    e.preventDefault();

    // Se localiza el click en el boton comprar
    if (e.target.classList.contains("comprarButton")){
        let button = event.target;
        let productoCompra = button.closest(".producto");
        //pasamos el producto a obtenerDatos()
        obtenerDatos(productoCompra)
        
    }
}
//obtenemos los datos del producto a comprar comprobamos la cantidad y los guardamos en un objeto "datosProductos"
function obtenerDatos(productoCard){
    //Comprobamos Cantidad de productos
    let existeProducto = false;
    if(carrito.length > 0){
        for(let i in carrito){
            
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
        //agregamos la compra al carrito de compras        
        carrito.push(datosProducto);
    }
  guardarStorage();
    
}

// Guardamos en el Local storage
function guardarStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));

    //funcion para crear el carrito en el html
    renderizarCarrito();
}

//comprobamos y hay productos en el localStorage 
let contenedorCarrito = document.querySelector("#carrito");
if(localStorage.length >= 1){renderizarCarrito()}


//creamos productos a comprar en el html del carrito junto con el precio total
function renderizarCarrito(){
    const currentpage = window.location.pathname;
    const pathEnd = '/finalizarCompra.html';
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
            <div class="${currentpage === pathEnd ? 'col-6' : 'col-6'}">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3 ">
                    <img src='${producto.img}' class="shopping-cart-image">
                    <h6 class="shopping-cart-item-title${currentpage === pathEnd ? '-black' : ''} shoppingCartItemTitle text-light ml-3 mb-0">${producto.nombre}
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
                    ${currentpage === pathEnd ? '<div class="cantidad-compra">' + producto.cantidad + '</div>' : 
                    `<input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                        value="${producto.cantidad}">`}
                    <button class="btn btn-danger buttonDelete ${currentpage === pathEnd ? 'hide' : ''} " type="button">X</button>
                </div>
            </div>
        </div>
        ` 
        // evento para borrar 
        row.querySelector('.buttonDelete').addEventListener('click',borrarItems)
        contenedorCarrito.appendChild(row)
        //evento click para borrar compra
        row.querySelector('.buttonDelete').addEventListener('click', obtenerDatoBorra)
    })
    $('#total').val(subtotal);

    console.log('subtotal: '+subtotal);

    $(".total-compra").append(`
    <div class="total">${subtotal}</div>`);
}
//funcion que limpia el carrito
function limpiarCarrito(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

//obtenemos el div a borrar
function obtenerDatoBorra(event){
    let buttonclick = event.target;
    let productoBorrar = buttonclick.closest(".row"); 
    
    obtenerId(productoBorrar)
}

// Obtenemos el nombre del producto a borrar para pasarlo por la funcion borrarCopra
function obtenerId (procuctoBorrar){

    let itemId = procuctoBorrar.querySelector('.productoId').textContent;
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
   console.log('xxx', window.location.href);
});

//evento de compra final nos envia a la pagina de datos de compra
$('#finalizar-compra').click(function() {
    window.location.href = 'finalizarCompra.html';
});

// form que guarda los datos el cliente
$("#form").submit((e)=>{
    e.preventDefault();
    let formValues = new FormData(e.target);
    let nuevaCompra = {nombre: formValues.get("nombre"), dni: formValues.get("dni"), credirCard: formValues.get("credit-number"), vencimiento: formValues.get("fecha"), cvc: formValues.get("cvc")};
    form.reset();
    clienteCompra.push(nuevaCompra);
    console.log(nuevaCompra);
    localStorage.setItem("cliente", JSON.stringify(clienteCompra));
    alert("Compra procesada exitosamente muchas gracias")

})



