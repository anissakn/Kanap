// récupération de l'id du produit
const url = window.location.search
const idSearch = new URLSearchParams(url)
const idGet = idSearch.get('id')

//récupération des données du produit spécifique via l'API
let products = fetch('http://localhost:3000/api/products/'+ idGet)
.then(reponse => reponse.json())
.then(products => {
    //injection des données dans le DOM
    const title = document.querySelector('title')
    title.innerText = products.name

    const img = document.querySelector('.item__img img')
    img.setAttribute('src', products.imageUrl)
    img.setAttribute('alt', products.altTxt)

    const h1 = document.querySelector('.item__content__titlePrice h1')
    const prix = document.getElementById('price')
    h1.innerText = products.name
    prix.innerText = products.price

    const description = document.getElementById('description')
    description.innerText = products.description

    couleurs = document.getElementById('colors')
    choixCouleur = products.colors

    //mise en place du menu déroulant pour le choix de la couleur
    for (let i = 0; i < choixCouleur.length; i++){
        const couleurOption = document.createElement('option')
        couleurOption.setAttribute('value', choixCouleur[i])
        couleurs.appendChild(couleurOption)
        couleurOption.innerText = choixCouleur[i]
    }

    // création du panier
    const ajoutPanier = document.getElementById('addToCart')
    ajoutPanier.addEventListener('click', panier)

    // évènement qui va ajouter les produits dans le panier
    function panier(){
        const itemQuantity = document.getElementById('quantity').value
        const selectedColor = couleurs.querySelector('option:checked').value

        const item = {
            id_local : products._id,
            quantity_local : Number(itemQuantity),
            color_local : selectedColor
        }
        
        //si le localstorage est vide
        if(itemQuantity != 0 && selectedColor != '' && localStorage.panier == null){ 
            const tableau = []
            localStorage.setItem('panier', tableau)
            tableau.push(item)
            localStorage.setItem('panier', JSON.stringify(tableau))
            alert('Ajouté au panier !')
        // si le localstorage contient des données
        }else if(itemQuantity != 0 && selectedColor != '' && localStorage.panier != null){
            //récupération de ces données et transformation en tableau exploitable
            const getItems = localStorage.getItem('panier')
            const itemsArray = JSON.parse(getItems)

            // se transformera en vrai seulement si la condition l.72 s'éxecute
            let productInCart = false

            // parcourt tous les éléments du tableau de données pour voir si le produit y est déjà présent
            for (const element of itemsArray){
                // si c'est le cas:
                if(element.id_local == products._id && element.color_local == selectedColor){
                    element.quantity_local += Number(itemQuantity)
                    localStorage.setItem('panier', JSON.stringify(itemsArray))
                    productInCart = true
                    break
                }       
            }
            
            // si productInCart ne s'est pas éxecuté dans la condition l.72: ajout du nouveau produit dans le tableau
            if(productInCart == false){
                itemsArray.push(item)
                localStorage.setItem('panier', JSON.stringify(itemsArray))
            }
            alert('Ajouté au panier !')         
        }else{
            alert('Choisir la quantité et la couleur du modèle')
        }
    }
})
