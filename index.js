const API_KEY = 'b9a312f5ab4d4e411d2b378c03669614'

const elClima = document.getElementById('clima')
const elTempo = document.getElementById('tempo')
const elLocal = document.getElementById('local')
const elVento = document.getElementById('vento')
const elUmidade = document.getElementById('umidade')
const elCard = document.querySelector('.card')
const backgroundEl = document.querySelector('.background')

async function getCoordinates(cityName) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    const response = await fetch(geoUrl)
    const data = await response.json()

    if (data.length === 0) {
        throw new Error("Cidade não encontrada")
    }

    return {
        lat: data[0].lat,
        lon: data[0].lon
    }
}

async function getWeatherData(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt`
    const response = await fetch(weatherUrl)
    return await response.json()
}

async function handSubmit(event) {
    event.preventDefault()
    const value = document.querySelector('[name="local"]').value

    try {
        const { lat, lon } = await getCoordinates(value)
        const data = await getWeatherData(lat, lon)

        console.log(data)

        elTempo.innerHTML = Math.floor(data.main.temp) + '°C'
        elLocal.innerHTML = data.name
        elUmidade.innerHTML = data.main.humidity + '%'
        elVento.innerHTML = data.wind.speed + ' km/h'

        const weatherMain = data.weather[0].main.toLowerCase()

        // Atualiza o ícone do clima
        const src = `./assets/${weatherMain}.png`
        elClima.setAttribute('src', src)

        // Atualiza o background com base no clima
        switch (weatherMain) {
            case 'clear':
                backgroundEl.style.backgroundImage = "url('./assets/Tempo-Ensolarado.jpg')"
                break
            case 'clouds':
            case 'mist':
            case 'fog':
                backgroundEl.style.backgroundImage = "url('./assets/Tempo-Nublado.jpg')"
                break
            case 'rain':
            case 'drizzle':
            case 'thunderstorm':
                backgroundEl.style.backgroundImage = "url('./assets/Tempo-Chuvoso.jpg')"
                break
            case 'snow':
                backgroundEl.style.backgroundImage = "url('./assets/Tempo-Nevado.jpg')"
                break
            default:
                backgroundEl.style.backgroundImage = "url('./assets/Tempo-Padrao.jpg')" // fallback
                break
        }

        // Exibe o card de dados
        elCard.classList.add('show')

        // Exibe a main e footer com animação
        document.querySelector('main').classList.add('show')
        document.querySelector('footer').classList.add('show')

    } catch (err) {
        alert(err.message)
        console.error(err)
    }
}

document.querySelector('form').addEventListener('submit', handSubmit)
