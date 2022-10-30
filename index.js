const PORT = process.env.PORT || 3000
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const app = express()

const newspapers = [
    {
        name:'toi',
        address:'https://timesofindia.indiatimes.com/topic/climate-change',
        baseUrl:''
    },
    {
        name:'guardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        baseUrl:''
    },
    {
        name:'bbc',
        address:'https://www.bbc.com/news/science-environment-56837908',
        baseUrl:'https://www.bbc.com'
    },
    {
        name:'nytimes',
        address:'https://www.nytimes.com/section/climate',
        baseUrl:''
    }
]

const articles = []

newspapers.forEach((newspaper)=>{
    axios.get(newspaper.address)
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url:newspaper.baseUrl+url,
                source:newspaper.name
            })
        })
    })
})

app.get('/',(req,res)=>{
    res.json('Home Page')
})

app.get('/news',(req,res)=>{
    res.json(articles)
})

app.get('/news/:newspaperId',(req,res)=>{
    const query = req.params.newspaperId
    const newspaper = articles.filter((article)=> article.source === query)
    res.json(newspaper)
})

app.listen(PORT,()=>{
    console.log('Server running on port 3000')
})