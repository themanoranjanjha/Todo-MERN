const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(reqestHandler(req, res, next))
        .catch((err) => next(err))
    }
} 