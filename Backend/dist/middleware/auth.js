import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access token is missing or invalid' });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET || 'supersecretjwtkeyforblogauth12345';
        const decoded = jwt.verify(token, secret);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, username: true },
        });
        if (!user) {
            res.status(401).json({ error: 'User no longer exists' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Token is invalid or expired' });
        return;
    }
};
