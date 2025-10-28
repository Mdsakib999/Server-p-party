import ApiError from "../utils/ApiError.js";

const notFound = (req, _res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
};

export default notFound;
