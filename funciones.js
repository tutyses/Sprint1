const datos = require('./datos');
let users = datos.users;
let menu = datos.menu;
let activeUser = datos.activeUser;
let pedidos = datos.pedidos;
let nuevomenu = datos.nuevomenu;
let numOrden = datos.numOrden;
let mediosPagos = datos.mediosPagos;
//Validar que el usuario no esta duplicado cuando se registra

function validarUsuario(user,req,res) {

    let userDuplicado = false;
    let mailDuplicado = false;

    if (users.length === 0) {
        if (user.isAdmin === undefined) {
            user.isAdmin = false;
        }
        users.push(user)
        res.status(201).send('Usuario creado')
       
        return;
    } else {


        if (users.length > 0) {
            for (let i = 0; i < users.length; i++) {
                const userR = users[i].name
                const userMail = users[i].mail



                if (userR === user.name) {
                    userDuplicado = true;
                    console.log("usuario duplicado")
                    res.status(401).send('Usuario duplicado')
                    return;
                }
                if (userMail === user.mail){
                    mailDuplicado = true;
                    console.log("Mail duplicado")
                    res.status(401).send('mail duplicado')
                    return;
                }
                


                if (i + 1 === users.length && userDuplicado === false && mailDuplicado === false) {
                    if (user.isAdmin === undefined) {
                        user.isAdmin = false;
                    }
                    console.log("EjecucionPush");
                    users.push(user)
                    res.status(201).send('Usuario creado')
                    return;
                }
            }
        }
    }
}
//Valida que el que se 
function validarAdmin(activeUser) {
    if (activeUser.isAdmin) {
        console.log("Privilegios Admin")
        return true;

    } else {
        console.log("No tiene privilegios de admin")
        return false;
    }


}
// Checkea que no sea admin
function validarLogin(activeUser) {
    if (activeUser.isAdmin === false) {
        return true;
    } else {
        console.log("Admins no pueden realizar pedidos")
    }
}
// Realizar pedido
//Estado 0 = Pendiente, 1 = Confirmado, 2 = Preparacion, 3 = Enviado, 4 = Entregado 
function hacerPedido(activeUser, req, res) {

    if (validarLogin(activeUser)) {
        // Obtener index del Usuario 

        let indexUser = users.findIndex(infind => infind === activeUser)
        let indexPedido = pedidos.length;
        let fechams = new Date()
        let fecha = fechams.toDateString();
        //let pedidoNuevo = {}        
        for (const item of req.body) {

            const pedidoNuevo = {
                fecha,
                idUser: indexUser,
                idPedido: numOrden,
                idMeal: item.pedido,
                cantidad: item.cantidad,
                metododepago: item.metododepago,
                estado: '0'
            }

            if (validarMenu(pedidoNuevo)&validarMetodo(pedidoNuevo)) {
                pedidos.push(pedidoNuevo);
              // agregar al final del ciclo  res.status(201).send('Pedido creado')
                

            } else {
                console.log('Idmeal o metodo invalido');
                res.status(400).send('Idmeal o metodo invalido')
                
            }



        }

        console.log(pedidos);

    }
    numOrden = numOrden + 1;
}


//OK
function confirmarPedido(activeUser, req, res) {
    if (validarLogin(activeUser)) {
        const pedidoSeleccionado = { pedidoSeleccionado: req.body.pedidoSeleccionado };

        // let indexUser = users.findIndex(infind => infind === activeUser)
        for (let i in pedidos) {
            console.log('For ejecutado, valores')
            console.log(i)
            console.log(pedidoSeleccionado.pedidoSeleccionado)
            if (pedidos[i].idPedido == pedidoSeleccionado.pedidoSeleccionado) {
                
                pedidos[i].estado = 1;
                console.log('El pedido ha sido confirmado', pedidos);
                res.status(201).send('Pedido confirmado')
                return;
            }
        }
    }
}
//ok
function verHistorial(activeUser, req, res) {

    if (validarLogin(activeUser)) {
        const indexUser = users.findIndex(infind => infind === activeUser)
        let showHistorial = [];
        for (let i in pedidos) {

            if (pedidos[i].idUser == indexUser) {
                //let showHistorial[i] = pedidos[i];

                showHistorial.push(pedidos[i]);
                console.log('Show historial :');
                console.log(showHistorial)

                if (i == pedidos.length - 1) {
                    res.json(showHistorial)
                }
            }
        }

    }
}
// OK
function verPedidos(activeUser, req, res) {
    if (validarAdmin(activeUser)) {
        let verPedidos = { idUser: req.body.idUser, estado: req.body.estado }
        //4 casos, idUser NA, idUser y idPedido NA, idPedido NA o ambos datos son enviados 
        if (verPedidos.idUser === "" & verPedidos.estado === "") {
            let pedidosMatch = [];
            for (let i in pedidos) {
                pedidosMatch.push(pedidos[i]);
                console.log('Mostrando un elemento sin match')
                console.log(i);
                console.log(pedidos.length - 1)
                if (i == pedidos.length - 1) {
                    console.log('ejecutando res.json');
                    res.json(pedidosMatch);
                }

            }
            // Mostrar TODOS LOS PEDIDOS
        }
        if (verPedidos.idUser != "" & verPedidos.estado === "") {
            let pedidosMatch = [];
            for (let i in pedidos) {
                console.log('Id User match');
                if (pedidos[i].idUser == verPedidos.idUser) {
                    pedidosMatch.push(pedidos[i]);
                    console.log(pedidosMatch);
                    console.log('Mostrando un elemento match IdUser')
                    if (i == pedidos.length - 1) {
                        res.json(pedidosMatch[i]);
                    }
                    // Mostrar pedidos que matcheen idUser
                }
            }

        }

        if (verPedidos.idUser === "" & verPedidos.estado != "") {
            let pedidosMatch = [];
            for (let i in pedidos) {
                console.log('Status match');
                if (pedidos[i].estado == verPedidos.estado) {
                    pedidosMatch.push(pedidos[i]);
                    console.log(pedidosMatch);
                    console.log('Mostrando un elemento Status match')
                    if (i == pedidos.length - 1) {
                        res.json(pedidosMatch);
                    }
                    // Mostrar pedidos que matcheen idUser
                }
            }

        }
        if (verPedidos.idUser != "" & verPedidos.estado != "") {
            let pedidosMatch = [];
            for (let i in pedidos) {
                console.log('Status & IdUser match');
                if (pedidos[i].estado == verPedidos.estado && pedidos[i].idUser == verPedidos.idUser) {
                    pedidosMatch.push(pedidos[i]);
                    console.log(pedidosMatch);
                    console.log('Mostrando un elemento Status & Iduser match')
                    if (i == pedidos.length - 1) {
                        res.json(pedidosMatch);
                    }
                    // Mostrar pedidos que matcheen idUser
                }
            }
        }
    }
}
//NOT OK
function adminEditarestado(activeUser, req, res) {
    if (validarAdmin(activeUser)) {
        const id = { idPedido: req.body.idPedido }
        const nuevoEstado = { nuevoEstado: req.body.nuevoEstado }
        for (let i in pedidos) {
            console.log('For ejecutado, valores')
            console.log(i)

            if (pedidos[i].idPedido == id.idPedido) {
                console.log('Ejecutado')
                pedidos[i].estado = nuevoEstado.nuevoEstado;
                console.log('El nuevo estado es', nuevoEstado.nuevoEstado);
            }
        }
    }
}
//OK
function validarMenu(pedidoNuevo) {

    for (let j = 0; j < menu.length; j++) {

        if (pedidoNuevo.idMeal == menu[j].id) {
            return true;
        }



    }
}
//OK
function editarMenu(activeUser, req, res) {
    if (validarAdmin(activeUser)) {
        const id = { idmenu: req.body.idmenu }
        const newmeal = { meal: req.body.meal }

        for (let i in menu) {
            console.log('For ejecutado, valores')
            console.log(i)
            console.log(id.idmenu)

            if (menu[i].id == id.idmenu) {
                menu[i].meal = newmeal.meal;
                console.log(menu)

            }
        }
    }
}
function eliminarMenu(activeUser, req, res) {
    if (validarAdmin(activeUser)) {
        const id = { idmenu: req.body.idmenu }
        for (let i in menu) {
            if (menu[i].id == id.idmenu) {

menu.splice(i,1);
console.log(menu)

            }

        }
    }
}

function crearMedio (activeUser, req, res){
    if (validarAdmin(activeUser)){
        const idMedio = mediosPagos.length;

        const nuevoMedio = {id: idMedio, metodo: req.body.metodo}

        mediosPagos.push(nuevoMedio);
        

console.log(mediosPagos);
     

    }
}
function mostrarMedio (activeUser, req, res){
    if (validarAdmin(activeUser)){
console.log(mediosPagos)
       res.send(mediosPagos);

    }
}
function validarMetodo(pedidoNuevo) {

    for (let j = 0; j < mediosPagos.length; j++) {
//console.log(pedidoNuevo.metododepago)
//console.log(mediosPagos[j].id)
        if (pedidoNuevo.metododepago == mediosPagos[j].id) {
            return true;
        }



    }
}



module.exports = {
    validarUsuario,
    validarAdmin,
    validarLogin,
    confirmarPedido,
    verHistorial,
    verPedidos,
    hacerPedido,
    adminEditarestado,
    editarMenu,
    eliminarMenu,
    crearMedio,
    mostrarMedio

};
