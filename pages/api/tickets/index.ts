import type { NextApiRequest, NextApiResponse } from 'next'
import {ITicket} from "../../../models/ticket";
import {getTickets} from "../../../services/googleSheets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const tickets = await getTickets();

  res.status(200).json({ success: true, tickets })
}
