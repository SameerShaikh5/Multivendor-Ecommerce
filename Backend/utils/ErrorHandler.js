
class ErrorHandler extends Error {

    constructor(statusCode, message) {
        super(message)

        this.status = statusCode;

    }

}

export default ErrorHandler