import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowLeft, Clock, User, Edit2, Trash2, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/${id}`);
        setPost(response.data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch the story details. The story may have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this story? This action cannot be undone.')) {
      return;
    }
    setError('');
    setDeleting(true);

    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete the post.');
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', color: 'var(--text-secondary)' }}>
        <p>Opening story...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ maxWidth: '800px', padding: '40px 24px' }}>
        <button onClick={() => navigate('/')} className="btn btn-text" style={{ marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to explore
        </button>
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{error || 'Post not found.'}</span>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === post.authorId;

  return (
    <article className="container post-detail-wrapper" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <button onClick={() => navigate(-1)} className="btn btn-text" style={{ padding: '8px 12px', marginBottom: '32px' }}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', fontSize: '14px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <User size={16} color="var(--primary)" />
            <span>Written by @{post.author.username}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Clock size={16} />
            <span>Published on {formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="post-detail-content">
        {post.content}
      </div>

      {isAuthor && (
        <div className="post-actions">
          <Link to={`/edit-post/${post.id}`} className="btn btn-secondary">
            <Edit2 size={16} />
            Edit Story
          </Link>
          <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
            <Trash2 size={16} />
            {deleting ? 'Deleting...' : 'Delete Story'}
          </button>
        </div>
      )}
    </article>
  );
};

export default PostDetails;
