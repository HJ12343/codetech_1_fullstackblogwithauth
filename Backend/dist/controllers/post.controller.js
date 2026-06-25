import prisma from '../config/db.js';
export const createPost = async (req, res) => {
    try {
        const { title, content, published } = req.body;
        if (!title || !content) {
            res.status(400).json({ error: 'Title and content are required' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published !== undefined ? published : true,
                authorId: req.user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json({
            message: 'Post created successfully',
            post,
        });
    }
    catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Something went wrong while creating the post' });
    }
};
export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json({ posts });
    }
    catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Something went wrong while fetching posts' });
    }
};
export const getPostById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid post ID' });
            return;
        }
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json({ post });
    }
    catch (error) {
        console.error('Get post by id error:', error);
        res.status(500).json({ error: 'Something went wrong while fetching the post' });
    }
};
export const updatePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content, published } = req.body;
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid post ID' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        if (post.authorId !== req.user.id) {
            res.status(403).json({ error: 'Forbidden: You can only edit your own posts' });
            return;
        }
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: title !== undefined ? title : post.title,
                content: content !== undefined ? content : post.content,
                published: published !== undefined ? published : post.published,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        res.json({
            message: 'Post updated successfully',
            post: updatedPost,
        });
    }
    catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ error: 'Something went wrong while updating the post' });
    }
};
export const deletePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid post ID' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        if (post.authorId !== req.user.id) {
            res.status(403).json({ error: 'Forbidden: You can only delete your own posts' });
            return;
        }
        await prisma.post.delete({
            where: { id },
        });
        res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Something went wrong while deleting the post' });
    }
};
