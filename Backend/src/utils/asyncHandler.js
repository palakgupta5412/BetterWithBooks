const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next))       //resolving the promise returned by reqHandler
        .catch((err)=>next(err));           //throwing error to express default error handler or custom error handler
    }
}

export {asyncHandler};