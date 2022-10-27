import moment from "moment";
import {GoogleSpreadsheet} from 'google-spreadsheet';
import {IGoogleTicket, ITicket, mapGoogleTicketToModel} from "../models/ticket";

const authenticateAndGetSheetRef = async (): Promise<GoogleSpreadsheet> => {
    const doc = new GoogleSpreadsheet('1R1bNWGet7_HCaYftL-ygdilP2uvGSDR83vBeOpQ3NoE');

    // @ts-ignore
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    await doc.useServiceAccountAuth(credentials);

    await doc.loadInfo();

    return doc;
}

export const getTickets = async (): Promise<ITicket[]> => {
    const spreadsheets = await authenticateAndGetSheetRef();

    const sheetRows = await spreadsheets.sheetsByIndex[0].getRows();

    return sheetRows.reduce((acc: ITicket[], cur) => {
        // @ts-ignore
        if (cur['ID'] && cur['Nume'] && cur['Prenume'] && cur['Email']) {
            acc.push(mapGoogleTicketToModel(cur));
        }

        return acc;
    }, []);

}

export const addTicket = async (ticket: IGoogleTicket) => {
    const spreadsheets = await authenticateAndGetSheetRef();
    const ticketSheet = spreadsheets.sheetsByIndex[0];

    // @ts-ignore
    return ticketSheet.addRow(ticket);
}


export const updateTicketHasBeenUsed = async (ticketId: string) => {
    const spreadsheets = await authenticateAndGetSheetRef();

    const sheetRows = await spreadsheets.sheetsByIndex[0].getRows();

    const ticketRowIndex = sheetRows.findIndex((row) => row['ID'] === ticketId);

    if (ticketRowIndex === -1) throw new Error(`Eroare aparuta updatand utilizarea biletului ${ticketId}`);

    sheetRows[ticketRowIndex]['Bilet Folosit'] = true;
    sheetRows[ticketRowIndex]['Data Folosirii'] = moment().toISOString();;

    await sheetRows[ticketRowIndex].save();
}
