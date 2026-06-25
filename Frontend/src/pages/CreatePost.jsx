import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Send, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const CreatePost = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`${API_URL}/posts/${id}`);
          const post = response.data.post;
          
          if (post.authorId !== user?.id) {
            setError('Forbidden: You can only edit your own posts');
            return;
          }

          setTitle(post.title);
          setContent(post.content);
          setPublished(post.published);
        } catch (err) {
          console.error(err);
          setError('Could not retrieve post details.');
        } finally {
          setLoading(false);
        }
      };
      if (user) {
        fetchPost();
      }
    }
  }, [id, isEditMode, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/posts/${id}`, { title, content, published });
        navigate(`/posts/${id}`);
      } else {
        const response = await axios.post(`${API_URL}/posts`, { title, content, published });
        const createdPostId = response.data.post.id;
        navigate(`/posts/${createdPostId}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', color: 'var(--text-secondary)' }}>
        <p>Loading post editor...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '40px 24px', animation: 'fadeIn 0.4s ease-out' }}>
      <button onClick={() => navigate(-1)} className="btn btn-text" style={{ padding: '8px 12px', marginBottom: '24px' }}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="glass-card" style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          {isEditMode ? 'Edit Your Story' : 'Draft a New Story'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
          {isEditMode ? 'Refine your words, fix typos, or update publishing status.' : 'Write down your thoughts, structure ideas, and publish.'}
        </p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {error.includes('Forbidden') ? null : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" htmlFor="post-title">
                Title
              </label>
              <input
                id="post-title"
                type="text"
                className="form-input"
                style={{ fontSize: '18px', fontWeight: 600 }}
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" htmlFor="post-content">
                Story Content
              </label>
              <textarea
                id="post-content"
                className="form-input form-textarea"
                placeholder="Tell your story. Support paragraphs and rich text spacing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              <input
                id="published"
                type="checkbox"
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <label htmlFor="published" style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Publish immediately (make visible in the public feed)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {isEditMode ? 'Save Changes' : 'Publish Story'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
