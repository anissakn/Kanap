fetch('http://localhost:3000/api/products')
.then(reponse => reponse.json())
.then(products => {
    for (let i = 0; i < products.length; i++) {
    const ficheProducts = document.getElementById('items')

    const productItem = document.createElement('a')
    ficheProducts.appendChild(productItem)
    const aAttribut = productItem.setAttribute('href', './product.html?id=' + products[i]._id)

    const article = document.createElement('article')
    productItem.appendChild(article)

    const productName = document.createElement('h3')
    article.appendChild(productName)
    productName.setAttribute('class', 'productName')
    productName.innerText = products[i].name

    const productImage = document.createElement('img')
    article.appendChild(productImage)
    const imgHref = productImage.setAttribute('src', products[i].imageUrl)
    const imgAlt = productImage.setAttribute('alt', products[i].altTxt)

    const productDescription = document.createElement('p')
    article.appendChild(productDescription)
    productDescription.setAttribute('class', 'productDescription')
    productDescription.innerText = products[i].description
    }
})