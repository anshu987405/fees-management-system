import { ApiError } from "../utils/apiError.js";

export const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    throw new ApiError(422, "Validation failed", result.error.flatten());
  }

  req[source] = result.data;
  next();
};
