import * as jwt from 'jsonwebtoken';
import { logger } from './logging';

const secret = 'XgKTCSWmqNFwH35FbwPMbQQxcvDtHB';

export function sign(payload) {
    const options = {
        issuer: 'example.io',
        expiresIn: '1h',
        algorithm: 'HS256'
    };

    return jwt.sign({ payload }, secret, options);
}

export function verify(req, res) {
    try {
        // extract token
        const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
        const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : undefined;
        if (!token) {
            return undefined;
        }

        // verify token
        const { payload, iat } = jwt.verify(token, secret, {
            issuer: 'example.io'
        });

        // generate new token in every 15 minutes
        const diff = Math.floor(Date.now() / 1000) - iat;
        if (diff >= 15 * 60) {
            const newToken = sign(payload);
            res.set('Authorization', `Bearer ${ newToken }`);
        }

        return payload;
    } catch (err) {
        if (err.name !== 'TokenExpiredError') {
            logger.error('JWT token check failed', err);
        }
    }
}
