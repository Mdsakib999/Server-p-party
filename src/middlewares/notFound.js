import ApiError from "../utils/ApiError.js";

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export default notFound;
