'use strict'

// Website wide scripts
import axios from 'axios'

function randomColor() {

  const api = 'http://www.colr.org/json/color/random'
  const body = document.querySelector('body')

  axios.get(api).then(res => {
    let color = res.data.colors[0].hex

    if (!color) {
      console.error('Random color could not be fetched.')
    }

    color = '#' + color

    body.style.backgroundColor = color
  }).catch(() => console.error('Random color could not be fetched.'))
}

window.addEventListener('load', () => {
  randomColor()
  setInterval(randomColor, 8000)
});
