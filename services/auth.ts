import jwt from 'jsonwebtoken';
import type {NextApiRequest, NextApiResponse} from 'next'
import {getAccessToken} from '@auth0/nextjs-auth0';

export const validateUserClaims = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const {accessToken} = await getAccessToken(req, res);
    const userInfo = jwt.decode(`${accessToken}`);

    // @ts-ignore
    if (!(userInfo?.userRoles && userInfo?.userRoles.find((r) => r === 'ticket-admin'))) {
        throw new Error('Invalid credentials');
    }
}
