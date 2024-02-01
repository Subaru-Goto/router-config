export const errorHandler = async (err, req, res, next) => {
  //Process error retrieved by route handler or previous middleware and send back error message and status code
  console.log(err)
  const statusCode = err.statusCode || 500 ;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({error: message})
}   
