// récupération du panier dans le localstorage
const getCart = localStorage.getItem('panier')
const cartArray = JSON.parse(getCart)

const cart = document.querySelector('#cart__items')

//initialisation de la quantité et du prix total des articles
const totalArticles = 0
const totalQuantity = document.getElementById('totalQuantity')
totalQuantity.innerText = totalArticles

let totalPrice = 0
const totalPriceText = document.getElementById('totalPrice')

for(element of cartArray){
    // création balise article
    const items = document.createElement('article')
    cart.appendChild(items)
    items.setAttribute('class', 'cart__item')
    items.setAttribute('data-id', element.id_local)
    items.setAttribute('data-color', element.color_local)

    const id = element.id_local
    const colors = element.color_local
    const quantity = element.quantity_local

    //calcul de la quantité totale des articles
    const valeurInitiale = 0

    function totalArticlesFn(){
        const sommeQuantite = cartArray.reduce(
            (accumulateur, valeurCourante) => accumulateur + valeurCourante.quantity_local, valeurInitiale
        )

        const totalQuantity = document.getElementById('totalQuantity')
        totalQuantity.innerText = totalArticles + sommeQuantite
    }
    totalArticlesFn()

    //récupération des données dans l'API
    fetch('http://localhost:3000/api/products/' + id)
    .then(reponse => reponse.json())
    .then(products => {   
        //calcul du prix total des articles
        function totalPriceFn(){
            let productAndQuantity = products.price*quantity 
            totalPrice += productAndQuantity
            totalPriceText.innerText = totalPrice 
        }
        totalPriceFn()

        // création div image de l'item
        const itemImgDiv = document.createElement('div')
        items.appendChild(itemImgDiv)
        itemImgDiv.setAttribute('class', 'cart__item__img')

        const itemImg = document.createElement('img')
        itemImgDiv.appendChild(itemImg)
        itemImg.setAttribute('src', products.imageUrl)
        itemImg.setAttribute('alt', products.altTxt)

        // création div contenu de l'item : titre/couleur/prix
        const itemContentDiv = document.createElement('div')
        items.appendChild(itemContentDiv)
        itemContentDiv.setAttribute('class', 'cart__item__content')

        // div titre/couleur/prix
        const itemDescription = document.createElement('div')
        itemContentDiv.appendChild(itemDescription)
        itemDescription.setAttribute('class', 'cart__item__content__description')

        const title = document.createElement('h2')
        const color = document.createElement('p')
        const price = document.createElement('p')
        itemDescription.appendChild(title)
        itemDescription.appendChild(color)
        itemDescription.appendChild(price)
        title.innerText = products.name
        color.innerText = colors
        price.innerText = products.price + ' €'

        // création div setting : quantité d'items/option 'supprimer'
        const itemSettingsDiv = document.createElement('div')
        items.appendChild(itemSettingsDiv)
        itemSettingsDiv.setAttribute('class', 'cart__item__content__settings')

        // quantité d'items
        const itemQuantityDiv = document.createElement('div')
        itemSettingsDiv.appendChild(itemQuantityDiv)
        itemQuantityDiv.setAttribute('class', 'cart__item__content__settings__quantity')

        const p = document.createElement('p')
        itemQuantityDiv.appendChild(p)
        p.innerText = 'Qté : '

        const quantityInput = document.createElement('input')
        itemQuantityDiv.appendChild(quantityInput)
        quantityInput.setAttribute('type', 'number')
        quantityInput.setAttribute('class', 'itemQuantity')
        quantityInput.setAttribute('name', 'itemQuantity')
        quantityInput.setAttribute('min', '1')
        quantityInput.setAttribute('max', '100')
        quantityInput.setAttribute('value', quantity)

        //modification de la quantité
        quantityInput.addEventListener('change', quantityModification)   
                
        function quantityModification(){
            const itemGet = quantityInput.closest('article')
            const itemGetId = itemGet.dataset.id
            const itemGetColor = itemGet.dataset.color

            //stocker l'ancienne quantité
            cartArray.forEach(x => {
                if (x.color_local == colors && x.id_local == id)
                oldQuantity = x.quantity_local
            })

            //nouveau stockage de la quantité dans le localStorage
            for(el of cartArray){
                if(itemGetId == el.id_local && itemGetColor == el.color_local){
                    el.quantity_local = Number(quantityInput.value)
                    localStorage.setItem('panier', JSON.stringify(cartArray))
                }
            }
        
            //comparer l'ancienne quantité à la nouvelle pour augmenter ou baisser le montant final
            const newQuantity = quantityInput.value

            if(oldQuantity < newQuantity){
                const moreItems = newQuantity-oldQuantity
                const increasePrice = moreItems*products.price
                totalPrice += increasePrice
                totalPriceText.innerText = totalPrice
            }else if(oldQuantity > newQuantity){
                const lessItems = oldQuantity-newQuantity
                const decreasePrice = lessItems*products.price
                totalPrice -= decreasePrice
                totalPriceText.innerText = totalPrice
            }
            totalArticlesFn()
        }

        // option 'supprimer'
        const deleteOptionDiv = document.createElement('div')
        itemSettingsDiv.appendChild(deleteOptionDiv)
        deleteOptionDiv.setAttribute('class', 'cart__item__content__settings__delete')

        const deleteOption = document.createElement('p')
        deleteOptionDiv.appendChild(deleteOption)
        deleteOption.setAttribute('class', 'deleteItem')
        deleteOption.innerText = 'Supprimer'

        //action de suppression
        deleteOption.addEventListener('click', itemDeleted)

        function itemDeleted(){
            const itemGet = deleteOption.closest('article')
            const itemGetId = itemGet.dataset.id
            const itemGetColor = itemGet.dataset.color

            //suppression du prix des articles supprimés
            const deletePrice = products.price*quantityInput.value
            totalPrice -= deletePrice
            totalPriceText.innerText = totalPrice

            const differentItems = cartArray.filter((elt) => itemGetId !== elt.id_local || itemGetColor !== elt.color_local)
            cartArray.splice(0, cartArray.length)
            Array.prototype.push.apply(cartArray, differentItems)
            localStorage.setItem('panier', JSON.stringify(cartArray))

            alert('Article(s) supprimé(s) !')

            //disparition du DOM
            itemGet.remove()

            totalArticlesFn()
        }
    }) 
}


//regex pour la vérification des champs de saisie
const letters = /^[A-Za-z-\s]+$/
const lettersAndNumbers = /^[0-9a-zA-Z-\s]+$/
const emailAddress = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

//validation prénom (firstName) 
const firstName = document.getElementById('firstName')
const firstNameValidation = firstName.addEventListener('change', firstNameConfirmation)

function firstNameConfirmation(){
    const firstNameValue = firstName.value
    const testletters = letters.test(firstNameValue)
    if(testletters){
        const firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
        firstNameErrorMsg.innerText = 'Prénom valide'
    }else{
        firstNameErrorMsg.innerText = 'Veuillez rentrer votre prénom'
    }
}

//validation nom (lastName)
const lastName = document.getElementById('lastName')
const lastNameValidation = lastName.addEventListener('change', lastNameConfirmation)

function lastNameConfirmation(){
    const lastNameValue = lastName.value
    const testletters = letters.test(lastNameValue)
    if(testletters){
        const lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
        lastNameErrorMsg.innerText = 'Nom valide'
    }else{
        lastNameErrorMsg.innerText = 'Veuillez rentrer votre nom'
    }
}

//validation adresse postale (address)
const address = document.getElementById('address')
const addressValidation = address.addEventListener('change', addressConfirmation)

function addressConfirmation(){
    const addressValue = address.value
    const testlettersAndNumbers = lettersAndNumbers.test(addressValue)
    if(testlettersAndNumbers){
        const addressErrorMsg = document.getElementById('addressErrorMsg')
        addressErrorMsg.innerText = 'Adresse valide'
    }else{
        addressErrorMsg.innerText = 'Veuillez rentrer une adresse valide'
    }
}

//validation ville (city)
const city = document.getElementById('city')
const cityValidation = city.addEventListener('change', cityConfirmation)

function cityConfirmation(){
    const cityValue = city.value
    const testletters = letters.test(cityValue)
    if(testletters){
        const cityErrorMsg = document.getElementById('cityErrorMsg')
        cityErrorMsg.innerText = 'Ville valide'
    }else{
        cityErrorMsg.innerText = 'Veuillez rentrer votre ville'
    }
}

//validation adresse mail (email)
const email = document.getElementById('email')
const emailValidation = email.addEventListener('change', emailConfirmation)

function emailConfirmation(){
    const emailValue = email.value
    const testEmailAddress = emailAddress.test(emailValue)
    if(testEmailAddress){
        const emailErrorMsg = document.getElementById('emailErrorMsg')
        emailErrorMsg.innerText = 'Adresse mail valide'
    }else{
        emailErrorMsg.innerText = 'Veuillez rentrer une adresse mail valide'
    }
}


//envoi des données du formulaire et de la commande au serveur
const submit = document.querySelector('form')
submit.addEventListener('submit', (e) => {
    e.preventDefault()
    //objet contact
    const contact = {
        firstName : document.getElementById('firstName').value,
        lastName : document.getElementById('lastName').value,
        address : document.getElementById('address').value,
        city : document.getElementById('city').value,
        email : document.getElementById('email').value
    }
    
    //tableau des produits
    const products = cartArray.map(product => product.id_local)

    //si on arrive à récupérer les valeurs de l'objet
    if(contact.firstName == '' || contact.lastName == '' || contact.address == '' || contact.city == '' || contact.email == ''){
        alert('Veuillez remplir tous les champs')
    }else{
        let post = fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            body: JSON.stringify({contact, products}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then(json => {
            document.location.href =`confirmation.html?id=${json.orderId}`
        })
    }
})