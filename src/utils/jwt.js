import * as jwt from 'jsonwebtoken';
import { logger } from './logging';

const secret = 'XgKTCSWmqNFwH35FbwPMbQQxcvDtHB';

export function sign(payload) {
    const options = {
        issuer: 'example.io',
        expiresIn: '1h',
        algorithm: 'HS256'
    };

    return jwt.sign(payload, secret, options);
}

export function verify(token) {
    try {
        return jwt.verify(token, secret, {
            issuer: 'example.io'
        });
    } catch (err) {
        if (err.name !== 'TokenExpiredError') {
            logger.error('JWT token check failed', err);
        }
    }
}
