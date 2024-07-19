import { title } from 'process';
import { constants } from '../utils/constants';
import { ErrorRequestHandler } from "express";

const generateTitle = (statusCode: number): string => {
    switch(statusCode) { // title for status codes
        case constants.VALIDATION_ERROR:
            return "Validation Failed: Invalid input format"
        case constants.UNATHORIZED:
            return "Unauthorized: User not authenticated"
        case constants.FORBIDDEN:
            return "Forbidden: Access denied"
        case constants.NOT_FOUND:
            return "Not Found: Resource not found";
        case constants.SERVER_ERROR:
            return "Server Error: Internal server error";
        default:
            return `Unknown Error Code: ${statusCode}`;
    }
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const statusCode: number = res.statusCode || 500;
    res.json({ // error format
        title: generateTitle(statusCode),
        message: err.message,
        stackTrace: err.stack
    });
}

export default errorHandler;