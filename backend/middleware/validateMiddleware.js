// TODO: Schema validation middleware
export const validateMiddleware = (validator) => {
  return (req, res, next) => {
    // TODO: Validate req body/params/query against validator schema
    next();
  };
};

export default validateMiddleware;
