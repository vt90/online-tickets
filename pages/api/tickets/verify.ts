import type { NextApiRequest, NextApiResponse } from 'next';
import {getTickets, updateTicketHasBeenUsed} from "../../../services/googleSheets";
import {decodeTicketInfo} from "../../../services/tickets";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
  try {
    const { code } = req.query;

    // @ts-ignore
    const qrInfo = decodeTicketInfo(code);
    const tickets = await getTickets();

    const ticketIndex = tickets.findIndex((ticket) => {
      return (
          ticket._id === qrInfo._id &&
          ticket.firstName === qrInfo.firstName &&
          ticket.lastName === qrInfo.lastName &&
          ticket.email === qrInfo.email
      );
    });

    if (ticketIndex === -1) throw new Error('Bilet inexistent');

    if (tickets[ticketIndex].hasBeenUsed) {
      throw new Error(`Biletul a fost folosit deja in data de ${tickets[ticketIndex].hasBeenUsedTimestamp}`);
    }

    // @ts-ignore
    await updateTicketHasBeenUsed(tickets[ticketIndex]._id);

    res.status(200).json({ success: true })
  }
  catch (error) {
    // @ts-ignore
    res.status(500).json({ name: 'Internal server error', error: error?.message || error })
  }

}
