// TODO: Role-based access control middleware
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // TODO: Verify user role against allowedRoles
    next();
  };
};

export default roleMiddleware;
