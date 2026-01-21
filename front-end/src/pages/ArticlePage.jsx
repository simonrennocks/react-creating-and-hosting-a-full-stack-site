import {useState} from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import CommentsList from '../CommentsList';
import AddCommentForm from '../AddCommentForm';
import articles from '../article-content';

export default function ArticlePage() {
  const { name } = useParams();
  const { upvotes: initialUpvotes, comments: initialComments } = useLoaderData();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState(initialComments);

  async function onUpvoteClicked() {  
    const response = await axios.post(`/api/articles/${name}/upvote`);
    const updatedArticleData = response.data;
    setUpvotes(updatedArticleData.upvotes);
  }

  const article = articles.find(article => article.name === name);
  if (!article) return <h1>Article not found!</h1>;

  async function onAddComment({ nameText, commentText }) {
    const response = await axios.post(`/api/articles/${name}/comments`, {
      postedBy: nameText,     
      text: commentText
    });
    const updatedArticle = response.data;
    setComments(updatedArticle.comments);
  }
   
  return (
    <>
    <h1>{article.title}</h1>
    <button onClick={onUpvoteClicked}>Upvote</button>
    <p>This article has {upvotes} upvotes</p>
    {article.content.map((paragraph, key) => (
      <p key={paragraph}>{paragraph}</p>
    ))}
    <AddCommentForm onAddComment={onAddComment} />
    <CommentsList comments={comments} />
    </>
  );
}

export async function loader({ params }) {
  const response = await axios.get(`/api/articles/${params.name}`)
  const {upvotes, comments} = response.data;
  return {upvotes, comments};
}
  