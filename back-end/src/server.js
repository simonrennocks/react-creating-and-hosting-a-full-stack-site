import express from 'express'

const articleInfo = [
  { name: 'learn-react', upvotes: 10, comments: [] },
  { name: 'learn-node', upvotes: 5, comments: [] },
  { name: 'my-thoughts-on-react', upvotes: 7, comments: [] }
]

const app = express()

app.use(express.json())

app.post('/api/articles/:name/upvote', (req, res) => {
  const articleName = req.params.name
  const article = articleInfo.find((a) => a.name === articleName)

  if (article) {
    article.upvotes += 1
    res
      .status(200)
      .json({
        message: `The article ${articleName} now has ${article.upvotes} upvotes!`
      })
  } else {
    res.status(404).json({ message: 'Article not found' })
  }
})

app.post('/api/articles/:name/comments', (req, res) => {
  const articleName = req.params.name
  const { postedBy, text } = req.body         
  const article = articleInfo.find((a) => a.name === articleName)
  if (article) {
    article.comments.push({ postedBy, text })
    res.status(200).json(article)
  } else {   
    res.status(404).json({ message: 'Article not found' })
  }
})

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})
