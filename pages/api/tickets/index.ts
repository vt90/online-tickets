import type {NextApiRequest, NextApiResponse} from 'next'
import {withApiAuthRequired} from '@auth0/nextjs-auth0';
import {getTickets} from "../../../services/googleSheets";
import {validateUserClaims} from "../../../services/auth";

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    try {
        await validateUserClaims(req, res);

        const tickets = await getTickets();

        res.status(200).json({success: true, tickets})
    }
    catch (error) {
        // @ts-ignore
        res.status(500).json({name: 'Internal server error', error: error?.message || error})
    }
});
