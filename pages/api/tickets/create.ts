import moment from "moment";
import type { NextApiRequest, NextApiResponse } from 'next';
import {v4 as uuidv4} from "uuid";
import {withApiAuthRequired} from '@auth0/nextjs-auth0';
import {sendEmail} from "../../../services/email";
import {addTicket} from "../../../services/googleSheets";
import {generateQRCode} from "../../../services/qrCode";
import {encodeTicketInfo} from "../../../services/tickets";
import {validateTicket} from "../../../models/ticket";
import {validateUserClaims} from "../../../services/auth";

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await validateUserClaims(req, res);
    const ticket = req.body;

    validateTicket(ticket);

    ticket._id = uuidv4();
    ticket.createdAt = moment().toISOString();

    await addTicket({
      'ID': ticket._id,
      'Nume': ticket.lastName,
      'Prenume': ticket.firstName,
      'Email': ticket.email,
      'Major(a)': ticket.isAdult,
      'Include After Party': ticket.includesAfterParty,
      'Bilet Folosit (Bal)': false,
      'Bilet Folosit (Party)': false,
      // @ts-ignore
      'Data Folosirii (Bal)': null,
      // @ts-ignore
      'Data Folosirii (Party)': null,
      'Data Achizitiei': ticket.createdAt,
    });

    const qrInfo = encodeTicketInfo(ticket);
    const url = `${process.env.AUTH0_BASE_URL}/verify-ticket?code=${qrInfo}`;
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
});
