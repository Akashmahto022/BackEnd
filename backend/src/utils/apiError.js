class apiError extends Error{
    constructor(
        statusCode,
        message="Something went wron",
        errors = [],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (statck) {
            this.stack = this.statck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiError}