class ApiResponse {
    constructor(statusCode, data, message = "SUCCESSS"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}


export {ApiResponse}