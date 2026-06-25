import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, BookOpen, Clock, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Landing = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts`);
        setPosts(response.data.posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Could not load blog posts. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <section className="hero">
        <h1 className="hero-title">
          Share your ideas with the world. <span>Effortlessly.</span>
        </h1>
        <p className="hero-subtitle">
          Write, edit, and read stories that matter to you. A minimalist blogging space with clean typography and zero clutter.
        </p>
        <div>
          {user ? (
            <Link to="/create-post" className="btn btn-primary">
              Create a Story <ArrowRight size={16} />
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary">
                Get Started for Free
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Read Stories
              </Link>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '20px 0 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
          <BookOpen size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Featured Articles</h2>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p>Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>No stories published yet.</p>
            {user ? (
              <Link to="/create-post" className="btn btn-primary" style={{ marginTop: '12px' }}>
                Write the First Post!
              </Link>
            ) : (
              <p style={{ fontSize: '14px' }}>Sign in to write and publish your thoughts!</p>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="glass-card post-card">
                <div className="post-meta">
                  <span className="post-author">@{post.author.username}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <h3 className="post-title">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="post-excerpt">
                  {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                </p>
                <div className="post-footer">
                  <Link to={`/posts/${post.id}`} className="post-link">
                    Read Story <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Landing;
