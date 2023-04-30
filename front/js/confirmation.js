//récupération du numéro de commande
const url = window.location.search
const idSearch = new URLSearchParams(url)
const idGet = idSearch.get('id')

//ajout du numéro dans la page
const orderNumber = document.getElementById('orderId')
orderNumber.innerText = `${idGet}`

localStorage.clear()