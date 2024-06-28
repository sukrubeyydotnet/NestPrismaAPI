import { Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { CustomLoggerService } from "./custom-logger/custom-logger.service";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";


type ResponseObj = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object,
}


@Catch()
export class ExceptionFiler extends BaseExceptionFilter {
    private readonly customLogger = new CustomLoggerService(BaseExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const responseBody: ResponseObj = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: ''
        };

        if (exception instanceof HttpException) {
            responseBody.statusCode = exception.getStatus();
            responseBody.response = exception.getResponse();
        }

        else if (exception instanceof PrismaClientValidationError) {
            responseBody.statusCode = 422;
            responseBody.response = exception.message.replaceAll(/\n/g, '');
        }
        else {
            responseBody.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            responseBody.response = 'Internal Server Error';
        }

        response.status(responseBody.statusCode).json(responseBody);
        this.customLogger.error(responseBody.response, ExceptionFiler.name);

        super.catch(exception, host);
    }
}