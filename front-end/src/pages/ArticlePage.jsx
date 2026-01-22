import { useState } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import articles from '../data/article-content';
import { useUser } from '../useUser';

export default function ArticlePage() {
  const { name } = useParams();
  const { upvotes: initialUpvotes, comments: initialComments } = useLoaderData();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState(initialComments);

  const {isLoading, user} = useUser();

  async function onUpvoteClicked() { 
    const token = user && await user.getIdToken();
    const headers = token ? {authtoken: token} : {};
    const response = await axios.post(`/api/articles/${name}/upvote`, null, {headers});
    const updatedArticleData = response.data;
    setUpvotes(updatedArticleData.upvotes);
  }

  const article = articles.find(article => article.name === name);
  if (!article) return <h1>Article not found!</h1>;

  async function onAddComment({ nameText, commentText }) {
    const token = user && await user.getIdToken();
    const headers = token ? {authtoken: token} : {};
    const response = await axios.post(`/api/articles/${name}/comments`, {
      postedBy: nameText,     
      text: commentText
    }, {headers});
    const updatedArticle = response.data;
    setComments(updatedArticle.comments);
  }
   
  return (
    <>
    <h1>{article.title}</h1>
    {user && <button onClick={onUpvoteClicked}>Upvote</button>}
    <p>This article has {upvotes} upvotes</p>
    {article.content.map((paragraph, key) => (
      <p key={paragraph}>{paragraph}</p>
    ))}
    {user ?<AddCommentForm onAddComment={onAddComment} />
    : <p><strong>[ You must be logged in to add comments. ]</strong></p>}
    <CommentsList comments={comments} />
    </>
  );
}

export async function loader({ params }) {
  const response = await axios.get(`/api/articles/${params.name}`)
  const {upvotes, comments} = response.data;
  return {upvotes, comments};
}
  