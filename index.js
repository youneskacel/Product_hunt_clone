const TOKEN = 'Bearer c_HObEN14Ow_wksJNuQ2Df2JKuh9RDF5u6AttbMHXms'
const API_URL = 'https://api.producthunt.com/v1/'

var todaysPosts = []
var bestProducts = []

const getProductsFromToday = () => {
    const today = new Date().toLocaleDateString()
    return fetch(API_URL + `/posts?day=${today}`, {
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

const injectTodaysProducts = () => {
    var htmlToInject = ''
    for (let index = 0; index < todaysPosts.length; index++) {
        const { thumbnail, tagline, name } = todaysPosts[index];
        htmlToInject += `<div class="todayCard">
                        <img src="${thumbnail.image_url}" alt="" height="70px" width="70px">
                        <div class="descCont">
                            <div class="descbody">
                                <h6>${name}</h6>
                                <p>${tagline}</p>
                            </div>
                            <div class="refs">
                                <p>Free options</p>
                                <p>Prodctivity</p>
                            </div>
                        </div>
                    </div>`
    }
    document.getElementById('todays-container').innerHTML = htmlToInject
}

const _filterBestProducts = (products) => {
    const sorted = products.sort((a, b) => b.votes_count - a.votes_count)
    return sorted.slice(0, 4)
}



// FUNCTION CALLS

getBestProductsFromLastWeek().then(() => {
    injectBestProducts()
    var ctx = document.getElementById('barChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bestProducts.map(e => e.name),
            datasets: [{
                label: '# of Votes',
                data: bestProducts.map(e => e.votes_count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
})
getProductsFromToday().then(() => injectTodaysProducts())