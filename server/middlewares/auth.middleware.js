
//מאפשר הרשאת משתמשים מורשים בלבד- בעלי צמיד טוקן
import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authorization.split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        return next();

    } catch (error) {
        console.error("JWT verification error:", error.message);
        next({ status: 401, msg: "no premission" });
    }
}



