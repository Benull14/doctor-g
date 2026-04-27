import jwt from "jsonwebtoken";

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ message: "غير مصرح: لا يوجد توكن." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "غير مصرح: التوكن غير صالح." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "غير مصرح." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "ليس لديك صلاحية لهذه العملية." });
    }
    return next();
  };
}
