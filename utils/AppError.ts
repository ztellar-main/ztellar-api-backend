interface AppError {
    errorCode: any,
    statusCode: number,
    type:string
}

class AppError extends Error {
    constructor(errorCode: any, message: string, statusCode: number) {
        super(message)
        this.errorCode = errorCode
        this.statusCode = statusCode || 500
        this.type = 'AppError'
    }
}

export default AppError