//npm run devStart
const express = require('express')
//const { validarUsuario } = require('./middleware/validaciones') 
const app = express()

app.use(express.json())

const funciones = require('./src/funciones/funciones.js');
const validarUsuario = funciones.validarUsuario;
const validarAdmin = funciones.validarAdmin;
const validarLogin = funciones.validarLogin;
const confirmarPedido = funciones.confirmarPedido;
const verHistorial = funciones.verHistorial;
const verPedidos = funciones.verPedidos;
const hacerPedido = funciones.hacerPedido;
const adminEditarestado = funciones.adminEditarestado;
const editarMenu = funciones.editarMenu;
const eliminarMenu = funciones.eliminarMenu;
const editarMedio = funciones.editarMedio;
const mostrarMedio = funciones.mostrarMedio;
const crearMedio = funciones.crearMedio;
const datos = require('./src/datos');
const { documentacionSwagger } = require('./swagger.js');
let users = datos.users;
let menu = datos.menu;
let activeUser = datos.activeUser;
let pedidos = datos.pedidos;
let nuevomenu = datos.nuevomenu;
let numOrden = datos.numOrden;
//Rutas
//app.use(require('./routes/index'));
app.get('/users', (req, res) => {
    if(users.length != 0){

    
    res.json(users)
}else{
    res.send('No hay usuarios en la base de datos')
}
})

app.post('/users', (req, res) => {

     const user = { name: req.body.name, password: req.body.password, mail: req.body.mail, isAdmin: req.body.isAdmin }
    validarUsuario(user,req,res);
    console.log(user)
    

})
app.post('/users/login', (req, res) => {
    const user = users.find(user => user.name == req.body.name)
    if (user == null) {
        return res.status(400).send('No se puede encontrar el usuario')
    }
    try {
        if (req.body.password === user.password) {
           
            activeUser = user;
            console.log(activeUser);


            res.send('Login correcto')
        } else {
            res.send('Acceso denegado')
        }
    } catch {
        res.status(500).send('Error en el login')
    }
})





app.post('/users/pedido', (req, res) => {

    hacerPedido(activeUser, req, res);


   
})

app.get('/users/pedido', (req, res) => {


    verHistorial(activeUser, req, res);
})


app.put('/users/pedido', (req, res) => {

    confirmarPedido(activeUser, req, res);


    res.status(201).send()
})

<<<<<<< HEAD
app.post('/users/verpedidos', (req, res) => {
=======
app.get('/users/verpedidos', (req, res) => {
>>>>>>> 6a158cffd9988c6174dd912f1080257661b91db3


    verPedidos(activeUser, req, res);

})

app.put('/users/pedido/admineditarestado', (req, res) => {

    adminEditarestado(activeUser, req, res);


 //   res.status(201).send()
})

app.post('/users/menu', (req, res) => {
    let idNew;
    idNew = menu.length;

    nuevomenu = { id: idNew, meal: req.body.meal }
    if (validarAdmin(activeUser,req,res)) {
        if (req.body.meal != undefined & req.body.meal != ''){
            menu.push(nuevomenu);
            console.log(menu)
            res.status(201).send('Menu creado')
        }else{
            res.status(400).send('Error en la creacion de menu')
        }
      
    }
    
})

app.get('/users/menu', (req, res) => {
   // if (validarLogin(activeUser)) {
        res.send(menu);
  //  }

})
app.put('/users/menu', (req, res) => {

    editarMenu(activeUser, req, res);


    res.status(201).send()
})
app.delete('/users/menu', (req, res) => {

    eliminarMenu(activeUser, req, res);


    res.status(201).send()
})

app.get('/users/mediosdepago', (req, res) => {

    mostrarMedio(activeUser, req, res);

})
app.post('/users/mediosdepago', (req, res) => {

    crearMedio(activeUser, req, res);


    res.status(201).send()
})



app.listen(2001, ()=> {documentacionSwagger(app);console.log('Running 2001')} )





<<<<<<< HEAD
// 06 08 2021
=======

//Falta hacer rutas, arreglar MIddleware, Pulir Catches y hacer Swagger
//Añadir respuesta al envio de CRUD's
>>>>>>> 6a158cffd9988c6174dd912f1080257661b91db3
