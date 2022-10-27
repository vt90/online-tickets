import moment from "moment";
import type { NextApiRequest, NextApiResponse } from 'next';
import {v4 as uuidv4} from "uuid";
import {sendEmail} from "../../../services/email";
import {addTicket} from "../../../services/googleSheets";
import {generateQRCode} from "../../../services/qrCode";
import {encodeTicketInfo} from "../../../services/tickets";
import {validateTicket} from "../../../models/ticket";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const ticket = req.body;

    validateTicket(ticket);

    ticket._id = uuidv4();
    ticket.createdAt = moment().toISOString();

    const rowData = await addTicket({
      'ID': ticket._id,
      'Nume': ticket.lastName,
      'Prenume': ticket.firstName,
      'Email': ticket.email,
      'Data Achizitiei': ticket.createdAt,
      'Bilet Folosit': false,
      // @ts-ignore
      'Data Folosirii': null,
    });

    const qrInfo = encodeTicketInfo(ticket);
    const url = `${process.env.VERCEL_URL}/verify-ticket?code=${qrInfo}`;
    const qrCode = await generateQRCode(url);
    const imageb64 = qrCode.replace('data:image/png;base64,' , '');

    await sendEmail({
      to: ticket.email,
      subject: 'Confirmare comanda bilet',
      html: `
        <div style="padding: 70px 30px">
            <h1 style="text-align: center">Comanda confirmata</h1>
            
            <p style="text-align: center">
                Draga ${ticket.firstName} <br />
                Iti multumim pentru achizitia biletului. Atasat acestui mail este codul de access QR pe care va trebui sa-l prezinti la intrare.
            </p>
        </div>
      `,
      attachments: [{
        content: imageb64,
        filename: 'bilet.png',
        type: 'image/png',
      }]
    });

    res.status(200).json({ success: true })
  }
  catch (error) {
    // @ts-ignore
    res.status(500).json({ name: 'Internal server error', error: error?.message || error })
  }

}
