export const errorHandler = (err, req, res, next)=>{
    console.log(err.stack.red)

    res.status(err.code || 500).json({
        success:false,
        error:err.message || "Server Error"
    })
}
