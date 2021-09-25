const TOKEN = 'Bearer c_HObEN14Ow_wksJNuQ2Df2JKuh9RDF5u6AttbMHXms'
const API_URL = 'https://api.producthunt.com/v1/'

var todaysPosts = []
var bestProducts = []

const getProductsFromToday = () => {
    const today = new Date().toLocaleDateString()
    fetch(API_URL + `/posts?day=${today}`, {
        headers: {
            Authorization: TOKEN
        }
    }).then(res => res.json())
        .then(data => todaysPosts = data.posts)
        .catch(err => console.log(err))
}

const getBestProductsFromLastWeek = () => {
    return fetch(API_URL + `/posts?days_ago=7`, {
        headers: {
            Authorization: TOKEN,
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        }
    }).then(res => res.json())
        .then(data => bestProducts = _filterBestProducts(data.posts))
        .catch(err => console.log(err))
}

const injectBestProducts = () => {
    let htmlToInject = ''
    for (let index = 0; index < bestProducts.length; index++) {
        const { thumbnail, name, tagline } = bestProducts[index];
        htmlToInject += `<div class="lwcard">
                    <img src="${thumbnail.image_url}" alt="" height="80px" width="80px">
                    <div class="carddesc">
                        <h6>${name}</h6>
                    </div>
                    <div class="descBody">
                       ${tagline}
                    </div>
                </div>`
    }

    document.getElementById('lwContainer').innerHTML = htmlToInject
}

const _filterBestProducts = (products) => {
    const sorted = products.sort((a, b) => b.votes_count - a.votes_count)
    return sorted.slice(0, 4)
}



// FUNCTION CALLS

getBestProductsFromLastWeek().then(() => injectBestProducts())
