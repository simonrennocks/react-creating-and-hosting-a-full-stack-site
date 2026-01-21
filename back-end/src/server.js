import express from 'express'
import {MongoClient, ServerApiVersion} from 'mongodb';

const app = express()

app.use(express.json())

let db;

async function connectToDB(){
   const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri, {  
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,  
    } 
  }); 

  await client.connect();
  
  db = client.db('full-stack-react-db');
}


app.get('/api/articles/:name', async (req, res) => {
  const articleName = req.params.name
  const article = await db.collection('articles').findOne({ name: articleName }); 
  if (article) {
    res.status(200).json(article)
  }
  else {
    res.status(404).json({ message: 'Article not found' })
  }   
})

app.post('/api/articles/:name/upvote', async (req, res) => {
  const articleName = req.params.name
  const updatedArticle = await db.collection('articles').findOneAndUpdate(
    { name: articleName },
    { $inc: { upvotes: 1 } },
    { returnDocument: 'after' } 
  )

  if (updatedArticle) {

    res.status(200).json({
      message: `The article ${articleName} now has ${updatedArticle.upvotes} upvotes!`
    })
  } else {
    res.status(404).json({ message: 'Article not found' })
  }
})

app.post('/api/articles/:name/comments', async (req, res) => {
  const articleName = req.params.name
  const { postedBy, text } = req.body
  const updatedArticle = await db
    .collection('articles')
    .findOneAndUpdate(
      { name: articleName },
      { $push: { comments: { postedBy, text } } },
      { returnDocument: 'after' }
    )

  if (updatedArticle) {
    res.status(200).json(updatedArticle)
  } else {
    res.status(404).json({ message: 'Article not found' })
  }
})

async function startServer() {
  try {
    await connectToDB();      
    app.listen(8080, () => {
      console.log('Server is running on http://localhost:8080')
    } );
  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
}
startServer();


