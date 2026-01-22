import express from 'express'
import {MongoClient, ServerApiVersion} from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path'

import { fileURLToPath } from 'url';  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
  fs.readFileSync('./credentials.json')
)

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express()

app.use(express.json())

let db;

async function connectToDB(){
  const uri = !process.env.MONGODB_USERNAME
  ? 'mongodb://127.0.0.1:27017'
  : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.rvxdt4q.mongodb.net/?appName=Cluster0`
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

app.use(express.static(path.join(__dirname, '../dist')));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

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

app.use(async (req, res, next) => {
  const {authtoken} = req.headers
  if (authtoken) {
    const user = await admin.auth().verifyIdToken(authtoken)
    req.user = user;
    next()
  } else {
    res.sendStatus(400);
  }  
  
});

app.post('/api/articles/:name/upvote', async (req, res) => {
  const {name} = req.params
  const {uid} = req.user;
  
  const article =  await db.collection('articles').findOne({ name });

  const upvotedIds = article.upvotedIds || [];
  const canUpvote = uid && !upvotedIds.includes(uid);

  if (canUpvote) {
    const updatedArticle = await db.collection('articles').findOneAndUpdate(
      { name },
      {
        $inc: { upvotes: 1 },
        $push: { upvotedIds: uid }
      },
      { returnDocument: 'after' }
    )

    if (updatedArticle) {
      res.status(200).json(updatedArticle)
    } else {
      res.status(404).json({ message: 'Article not found' })
    }
  } else {
    res.status(403).json({ message: 'User has already upvoted this article' })
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

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await connectToDB();      
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    } );
  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
}

startServer();