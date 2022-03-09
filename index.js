const PORT = process.env.PORT || 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
  {
    name: 'hurriyet',
    address: 'https://www.hurriyet.com.tr/haberleri/kuresel-isinma',
    base: 'https://www.hurriyet.com.tr'
  },
  {
    name: 'cnnturk',
    address: 'https://www.cnnturk.com/haberleri/kuresel-isinma',
    base: 'https://www.cnnturk.com'
  },
  {
    name: 'sondakika',
    address: 'https://www.sondakika.com/kuresel-isinma/',
    base: 'https://www.sondakika.com'
  },
]
const articles = []
newspapers.forEach((newspaper) => {
  axios.get(newspaper.address)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)

      $('a:contains("küresel")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name
        })
      })

    })
})

app.get('/', (req, res) => {
  res.send('Küresel Isınma ile ilgili çıkan en son haberler.')
})

app.get('/haberler', (req, res) => {
  res.json(articles)
})





app.get('/haberler/:newspaperId', async (req, res) => {
  const newspaperId = req.params.newspaperId
  const newspaperAddress = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].address
  const newspaperBase = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].base


  axios.get(newspaperAddress)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      const sArticles = []

      $('a:contains("küresel")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        sArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId
        })
      })
      res.json(sArticles)
    }).catch(error => console.log(error.message))
})


app.listen(PORT, () => console.log(`server is running on port ${PORT}`))