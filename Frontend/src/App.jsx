import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostDetails from './pages/PostDetails.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-blob-container">
          <div className="bg-blob blob-1"></div>
          <div className="bg-blob blob-2"></div>
          <div className="bg-blob blob-3"></div>
        </div>

        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
