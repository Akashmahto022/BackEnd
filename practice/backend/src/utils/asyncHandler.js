const asyncHandler = (requestHandler) => {
  (err, req, res, next) => {
    Promise.resolvev(requestHandler(err, req, res, next)).catch((err) =>
      next(err)
    );
  };
};

export { asyncHandler };

// const asyncHandler=(fn)=> async(req, res, next)=>{
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
