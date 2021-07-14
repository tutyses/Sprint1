//Middleware
//Validar que el usuario no esta duplicado cuando se registra





function validarUsuario(user) {
    console.log(menu);
    let duplicado = false;
    console.log('aca2');
  
    if (users.length === 0) {
        console.log('aca3');
        if (user.isAdmin === undefined) {
            user.isAdmin = false;
        }
        users.push(user)
        return;
    } else {console.log('aca4');


        if (users.length > 0) {
            for (let i = 0; i < users.length; i++) {
                let userR = users[i].name



                if (userR === user.name) {
                    duplicado = true;
                    console.log("usuario duplicado")

                }



                if (i + 1 === users.length && duplicado === false) {
                    if (user.isAdmin === undefined) {
                        user.isAdmin = false;
                    }
                    console.log("EjecucionPush");
                    users.push(user)
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
        let pedidoNuevo = { fecha: fecha, idUser: indexUser, idPedido: indexPedido, idmeal: req.body.pedido, cantidad: req.body.cantidad, metododepago: req.body.metododepago, estado: '0' }
        //Agregar una validacion para num de pedidos que no existen 
        pedidos.push(pedidoNuevo);

        console.log('El ultimo pedido fue', pedidoNuevo);
        console.log('La lista de pedido es', pedidos);

    } else {
        res.send('Debe estar logeado');
    }
}

function confirmarPedido(activeUser, req, res) {
    if (validarLogin(activeUser)) {
        const pedidoSeleccionado = { pedidoSeleccionado: req.body.pedidoSeleccionado };

        // let indexUser = users.findIndex(infind => infind === activeUser)
        for (let i in pedidos) {

            if (pedidos[i].idPedido == pedidoSeleccionado.pedidoSeleccionado) {
                pedidos[i].estado = 1;
                console.log('El pedido ha sido confirmado', pedidos);
            }
        }
    }
}

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
function verPedidos(activeUser, req, res) {
    if (validarAdmin(activeUser)) {
        let verPedidos = { idUser: req.body.idUser, idPedido: req.body.idPedido }
        //4 casos, idUser NA, idUser y idPedido NA, idPedido NA o ambos datos son enviados 
        if (verPedidos.idUser === "" & verPedidos.idPedido === "") {
            let pedidosMatch = [];
            for (let i in pedidos) {
                pedidosMatch.push(pedidos[i]);
                console.log('Mostrando un elemento sin match')
                console.log(i);
                console.log(pedidos.length - 1)
                if (i == pedidos.length - 1) {
                    console.log('ejecutando res.json');
                    res.json(pedidos[i]);
                }

            }
            // Mostrar TODOS LOS PEDIDOS
        }
        if (verPedidos.idUser === "" & verPedidos.idPedido != "") {
            for (let i in pedidos) {

                if (pedidos[i].idUser == idUser) {
                    res.json(pedidos[i]);
                    console.log('Mostrando un elemento match IdUser')

                    // Mostrar pedidos que matcheen idUser
                }
            }
            if (verPedidos.idUser != "" & verPedidos.idPedido === "") {
                // Mostrar pedidos que matcheen idPedido
            }
            if (verPedidos.idUser != "" & verPedidos.idPedido != "") {
                // Mostrar pedidos que matcheen idUser y  idPedido
            }
        }
    } else {

        //  res.send("No tiene privilegios de administrador");
    }
}
function adminEditarestado(activeuser, req, res) {
    if (validarAdmin(activeUser)) {
        const id = { idPedido: req.body.idPedido }
        const nuevoEstado = { nuevoEstado: req.body.nuevoEstado }
        // Editar pedido de ese ID con ese estado
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
    adminEditarestado

};
