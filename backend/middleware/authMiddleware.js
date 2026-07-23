// TODO: Authentication middleware (JWT / Session verification)
export const authMiddleware = (req, res, next) => {
  // TODO: Add token authentication logic
  next();
};

export default authMiddleware;
