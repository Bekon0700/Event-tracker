let start = new Date();

let track = {
    viewTime: '',
    sectionClicked: [],
    startTime: '',
    endTime: ''
};

window.onload = async function () {
    const loadTrack = JSON.parse(localStorage.getItem('track'))
    loadTrack['path'] = window.location.pathname
    loadTrack['from'] = document.referrer
    console.log(loadTrack)
    const res = await fetch('http://localhost:3000/track', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loadTrack)
    })
    const result = await res.json()
    console.log(result)
}

document.addEventListener('click', async function (e) {
    console.log(e.target.classList[0])
    track.sectionClicked.push(e.target.classList[0])
    const targetSingleItem = e.target.closest('.single-item')
    const targetViewCart = e.target.closest('.btn-view-cart')
    const targetCheckout = e.target.closest('.btn-checkout')
    if (targetSingleItem || targetViewCart || targetCheckout) {
        trackEvent()
    }
})

document.addEventListener('click', async function (e) {
    const targetSearch = e.target.closest('.la-search')
    const targetAddCart = e.target.closest('.btn-add-to-cart')
    await eventStore('Search', targetSearch)

    let [currPrice, prevPrice] = document.querySelector('.product-price').textContent.split(' ')
    let productName = document.querySelector('.product-name').textContent
    const additionalInfo = {
        productName: productName,
        productPrice: currPrice,
        previousPrice: prevPrice
    }
    await eventStore('Add to Cart', targetAddCart, additionalInfo)
})

async function eventStore(eventName, event, additionalInfo={}) {
    if (event) {
        const firedEvent = {
            eventTime: new Date(),
            EventName: eventName,
            ...additionalInfo
        }

        const res = await fetch('http://localhost:3000/event', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firedEvent)
        })
        const result = await res.json()
        console.log(result)
    }
}

document.querySelector('.btn-add-to-cart').addEventListener('click', function () {
    let [currPrice, prevPrice] = document.querySelector('.product-price').textContent.split(' ')
    let productName = document.querySelector('.product-name').textContent
    track['productName'] = productName
    track['productPrice'] = currPrice
    track['previousPrice'] = prevPrice
    console.log(track)
})

const links = document.querySelectorAll('a')

links.forEach(link => {
    link.addEventListener('click', async function (e) {
        trackEvent()
    })
})

function trackEvent() {
    let end = new Date();
    let seconds = Math.floor((end - start) / 1000);
    track.viewTime = formatTime(seconds)
    track.startTime = start
    track.endTime = end
    localStorage.setItem('track', JSON.stringify(track))
}


function formatTime(time) {
    let sec = Math.floor(time % 60)
    let min = Math.floor((time / 60) % 60)
    let hour = Math.floor((time / 3600))

    sec = sec < 10 ? `0${sec}` : sec
    min = min < 10 ? `0${min}` : min
    hour = hour < 10 ? `0${hour}` : hour

    if (hour == 0) return `${min}:${sec}`

    return `${hour}:${min}:${sec}`
}