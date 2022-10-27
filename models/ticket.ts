export interface ITicket {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: string;
    hasBeenUsed?: boolean;
    hasBeenUsedTimestamp?: boolean;
}

export interface IGoogleTicket {
    ID: string;
    Nume: string;
    Prenume: string;
    Email: string;
    'Data Achizitiei': string;
    'Bilet Folosit': boolean | string;
    'Data Folosirii': string;
}

export const mapGoogleTicketToModel = (googleTicket: IGoogleTicket) => ({
    _id: googleTicket['ID'],
    firstName: googleTicket['Prenume'],
    lastName: googleTicket['Nume'],
    email: googleTicket['Email'],
    createdAt: googleTicket['Data Achizitiei'],
    hasBeenUsed: googleTicket['Bilet Folosit'] === 'TRUE',
    hasBeenUsedTimestamp: googleTicket['Data Folosirii'],
});

// @ts-ignore
export const validateTicket = (ticket) => {
    if (!(ticket.firstName && ticket.lastName && ticket.email)) {
        throw new Error('Ticket invalid')
    }
}

export const TICKET_KEY_NAME_PAIR = {
    // _id: 'ID',
    name: 'Nume',
    email: 'Email',
    createdAt: 'Data Achizitiei',
    hasBeenUsed: 'Bilet Folosit',
    hasBeenUsedTimestamp: 'Data Folosirii',
    actions: 'Actiuni'
};
