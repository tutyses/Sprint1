var users = []
var menu = [
    { 'id': 0, 'meal': 'Hamburguejas al vapor' },
    { 'id': 1, 'meal': 'Chorypattis al vapor' },
    { 'id': 2, 'meal': 'Pizza Napolitana' },
    { 'id': 3, 'meal': 'Empanada de Cholga' }
]
var activeUser;
var pedidos = [];
var nuevomenu;
var numOrden = 1;
var mediosPagos = [
    { 'id': 0, 'metodo': 'Contado' },
    { 'id': 1, 'metodo': 'Transferencia' },
]
module.exports = {
    users,
    menu,
    activeUser,
    pedidos,
    nuevomenu,
    numOrden,
    mediosPagos
};
