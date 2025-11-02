import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res, cookieName = "jwt") => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie(cookieName, token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting
    sameSite: "strict", // CSRF attacks cross-site request forgery
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
