const datos = require('../datos');
let users = datos.users;
let menu = datos.menu;
let activeUser = datos.activeUser;
let pedidos = datos.pedidos;
let nuevomenu = datos.nuevomenu;
let numOrden = datos.numOrden;
let mediosPagos = datos.mediosPagos;
//Validar que el usuario no esta duplicado cuando se registra

function validarUsuario(user, req, res) {

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
                if (userMail === user.mail) {
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
function validarAdmin(activeUser, req, res) {
    if (activeUser.isAdmin) {
        console.log("Privilegios Admin")

        return true;

    } else {
        res.status(401).send('No tiene privilegios suficientes')
        return false;
    }


}
// Checkea que no sea admin
function validarLogin(activeUser, req, res) {
    if (activeUser.isAdmin === false) {
        return true;
    } else {
        res.status(401).send('Admins no pueden realizar dicha accion')


    }
}
// Realizar pedido
//Estado 0 = Pendiente, 1 = Confirmado, 2 = Preparacion, 3 = Enviado, 4 = Entregado 
function hacerPedido(activeUser, req, res) {

    if (validarLogin(activeUser, req, res)) {
        // Obtener index del Usuario 

        let indexUser = users.findIndex(infind => infind === activeUser)
        let indexPedido = pedidos.length;
        let fechams = new Date()
        let fecha = fechams.toDateString();
        let i = 0;
        let pedidorealizado = false;
        for (const item of req.body) {

            i = i + 1;
            const pedidoNuevo = {
                fecha,
                idUser: indexUser,
                idPedido: numOrden,
                idMeal: item.pedido,
                cantidad: item.cantidad,
                metododepago: item.metododepago,
                estado: '0'
            }

            if (validarMenu(pedidoNuevo, req, res)) {
                if (validarMetodo(pedidoNuevo, req, res)) {


                    pedidos.push(pedidoNuevo);
                    pedidorealizado = true;
                    if (i == req.body.length - 1 & pedidorealizado == true) {
                        res.send('Pedido realizado')
                    }
                    // res.send('Pedido realizado')
                }
                // agregar al final del ciclo  res.status(201).send('Pedido creado')


            }



        }

        console.log(pedidos);

    }
    numOrden = numOrden + 1;

}


//OK
function confirmarPedido(activeUser, req, res) {
    if (validarLogin(activeUser, req, res)) {
        const pedidoSeleccionado = { pedidoSeleccionado: req.body.pedidoSeleccionado };

        // let indexUser = users.findIndex(infind => infind === activeUser)
        for (let i in pedidos) {
            let confirmado = false;
            console.log('For ejecutado, valores')
            console.log(i)
            console.log(pedidos.length)
            if (pedidos[i].idPedido == pedidoSeleccionado.pedidoSeleccionado) {
                confirmado = true;
                pedidos[i].estado = 1;
                console.log('El pedido ha sido confirmado', pedidos);
                //  res.status(201).send('Pedido confirmado')
                //return;
            }
            if (i == pedidos.length - 1 & confirmado == true) {
                res.send('Pedido confirmado')
            }
            if (i == pedidos.length - 1 & confirmado == false) {
                res.send('No se ha confirmado ningun pedido')
            }
        }
    }
}
//ok
function verHistorial(activeUser, req, res) {

    if (validarLogin(activeUser, req, res)) {
        const indexUser = users.findIndex(infind => infind === activeUser)
        let showHistorial = [];
        if (pedidos.length == 0) {
            res.send('No hay historial disponible')
        } else {

            for (let i in pedidos) {

                if (pedidos[i].idUser == indexUser) {
                    //let showHistorial[i] = pedidos[i];

                    showHistorial.push(pedidos[i]);
                    console.log('Show historial :');
                    console.log(showHistorial)

                    if (i == pedidos.length - 1) {
                        res.json(showHistorial)
                    }
                } else {
                    if (i == pedidos.length - 1) {
                        if (showHistorial.length == 0) {
                            res.send('No hay historial disponible')
                        }
                    }
                }
            }
        }

    }
}
// OK
function verPedidos(activeUser, req, res) {
    if (validarAdmin(activeUser, req, res)) {
        let verPedidos = { idUser: req.body.idUser, estado: req.body.estado }
        //4 casos, idUser NA, idUser y idPedido NA, idPedido NA o ambos datos son enviados 
        if (verPedidos.idUser === "" & verPedidos.estado === "") {
            console.log('Busqueda sin condiciones')
            let pedidosMatch = [];
            if (pedidos.length == 0) {
                res.send('No hay pedidos para mostrar')
            }
            for (let i in pedidos) {
                pedidosMatch.push(pedidos[i]);
                console.log('Mostrando elemento')
                console.log(i);
                console.log(pedidos.length - 1)
                if (i == pedidos.length - 1) {
                    console.log(pedidosMatch.length);
                    if (pedidosMatch.length != 0) {


                        res.json(pedidosMatch);
                    }
                }

            }
            // Mostrar TODOS LOS PEDIDOS
        }
        if (verPedidos.idUser != "" & verPedidos.estado === "") {
            let pedidosMatch = [];
            if (pedidos.length == 0) {
                res.send('No hay pedidos para mostrar')
            }
            for (let i in pedidos) {
                console.log('Id User match');
                if (pedidos[i].idUser == verPedidos.idUser) {
                    pedidosMatch.push(pedidos[i]);
                    console.log(pedidosMatch);
                    console.log('Mostrando un elemento match IdUser')
                    if (i == pedidos.length - 1) {
                        if (pedidosMatch.length == 0) {
                            res.send('No hay coincidencias')
                        } else {
                            res.json(pedidosMatch);
                        }
                    }
                    // Mostrar pedidos que matcheen idUser
                }
                if (i == pedidos.length - 1){
                    if(pedidosMatch.length == 0){
                        res.send('No hay coincidencias')
                    }
                }
            }

        }

        if (verPedidos.idUser === "" & verPedidos.estado != "") {
            let pedidosMatch = [];
            if (pedidos.length == 0) {
                res.send('No hay pedidos para mostrar')
            }
            for (let i in pedidos) {
                console.log('Status match');
                if (pedidos[i].estado == verPedidos.estado) {
                    pedidosMatch.push(pedidos[i]);
                    //   console.log(pedidosMatch);
                    console.log('Mostrando un elemento Status match')
                    if (i == pedidos.length - 1) {
                        console.log(pedidosMatch)

                        res.json(pedidosMatch);


                    }
                    // Mostrar pedidos que matcheen idUser
                }
                if (i == pedidos.length - 1){
                if(pedidosMatch.length == 0){
                    res.send('No hay coincidencias')
                }
            }
            }

        }
        if (verPedidos.idUser != "" & verPedidos.estado != "") {
            let pedidosMatch = [];
            if (pedidos.length == 0) {
                res.send('No hay pedidos para mostrar')
            }
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
                if (i == pedidos.length - 1){
                    if(pedidosMatch.length == 0){
                        res.send('No hay coincidencias')
                    }
                }
            }
        }
    }
}
//NOT OK
function adminEditarestado(activeUser, req, res) {
    if (validarAdmin(activeUser, req, res)) {
        let edicionOK = false;
        const id = { idPedido: req.body.idPedido }
        const nuevoEstado = { nuevoEstado: req.body.nuevoEstado }
        if(pedidos.length == 0){
            res.send('No existen pedidos')
        }
        for (let i in pedidos) {
            console.log('For ejecutado, valores')
            console.log(edicionOK)
            console.log(pedidos.length)

            if (pedidos[i].idPedido == id.idPedido) {

                pedidos[i].estado = nuevoEstado.nuevoEstado;
                console.log('El nuevo estado es', nuevoEstado.nuevoEstado);
                edicionOK = true;

                if (edicionOK === true & i == pedidos.length - 1) {
                    res.status(201).send('Edicion correcta');
                }

            }
            if (edicionOK === false & i == pedidos.length - 1) {

                res.status(400).send('Error en la edicion de estado')
            }
        }
    } else {
        // res.status(401).send('No tiene privilegios suficientes')
    }
}
//OK
function validarMenu(pedidoNuevo, req, res) {

    for (let j = 0; j < menu.length; j++) {
        //  console.log(j)
        //  console.log(menu.length)

        if (pedidoNuevo.idMeal == menu[j].id) {
            // console.log('Menu valido')
            return true;
        }
        if (j == menu.length - 1) {
            //console.log('Menu invalido')
            res.send('Menu o metodo invalido')
            return false;
        }



    }
}
//OK
function editarMenu(activeUser, req, res) {
    if (validarAdmin(activeUser, req, res)) {
        const id = { idmenu: req.body.idmenu }
        const newmeal = { meal: req.body.meal }
        let mealedit = false;

        for (let i in menu) {
            console.log('For ejecutado, valores')
            console.log(i)


            if (menu[i].id == id.idmenu) {
                menu[i].meal = newmeal.meal;
                res.status(202).send('Menu editado')
                mealedit = true;
                console.log(menu)

            }

            if (mealedit == false & i == menu.length - 1) {
                console.log('error en la edicion')
                res.send('Error en la edicion')
            }
        }
    }
}
function eliminarMenu(activeUser, req, res) {
    let mealdelete = false;
    if (validarAdmin(activeUser, req, res)) {
        const id = { idmenu: req.body.idmenu }
        for (let i in menu) {
            if (menu[i].id == id.idmenu) {
                mealdelete = true;
                menu.splice(i, 1);
                console.log(menu)

            }
            if (mealdelete == true & i == menu.length - 1) {
                res.send('Eliminacion de menu correcta')
            }
            if (mealdelete == false & i == menu.length - 1) {
                res.send('Error al eliminar menu')
            }
        }
    } else {
        //  res.status(401).send('No tiene privilegios suficientes')
    }
}

function crearMedio(activeUser, req, res) {
    if (validarAdmin(activeUser, req, res)) {
        const idMedio = mediosPagos.length;
        if (req.body.metodo != undefined & req.body.metodo != '') {


            const nuevoMedio = { id: idMedio, metodo: req.body.metodo }

            mediosPagos.push(nuevoMedio);


            console.log(mediosPagos);
            res.status(201).send('Medio creado')

        } else {
            res.status(400).send('Error en la creacion de medio')
        }
    }
}
function mostrarMedio(activeUser, req, res) {
    if (validarAdmin(activeUser,req,res)) {
        console.log(mediosPagos)
        res.send(mediosPagos);

    }else{
     //   res.send('No tiene privilegios')
    }
}
function validarMetodo(pedidoNuevo, req, res) {

    for (let j = 0; j < mediosPagos.length; j++) {
        //  console.log(pedidoNuevo.metododepago)
        //  console.log(mediosPagos[j].id)
        if (pedidoNuevo.metododepago == mediosPagos[j].id) {
            return true;
        }
        if (j == mediosPagos.length - 1) {
            res.send('Metodo invalido')
            return false;


        }



    }
}


//30/07/21
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
