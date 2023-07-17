import { NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

const als = new AsyncLocalStorage();
export const getStore = () => als.getStore();
export const ALS_CONTEXT = 'ALS_CONTEXT';

// TODO think about a good way to type the records in context
export interface IUser {

}

export const alsContextMiddleware = (
    req, res, next
) => {
    const requestContext = {
        user: {
            first: '',
            last: '',
            id: 123
        }
    }

    als.run(requestContext, () => {
        next();
    })
}