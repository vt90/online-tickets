export interface ITicket {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdult?: boolean;
    includesAfterParty?: boolean;
    hasBeenUsed?: boolean;
    hasBeenUsedParty?: boolean;
    hasBeenUsedTimestamp?: string;
    hasBeenUsedPartyTimestamp?: string;
    createdAt?: string;
}

export interface IGoogleTicket {
    ID: string;
    Nume: string;
    Prenume: string;
    Major: string;
    Email: string;
    'Include After Party': boolean | string;
    'Bilet Folosit (Bal)': boolean | string;
    'Bilet Folosit (Party)': boolean | string;
    'Data Folosirii (Bal)': string;
    'Data Folosirii (Party)': string;
    'Data Achizitiei': string;
}

export const mapGoogleTicketToModel = (googleTicket: IGoogleTicket) => ({
    _id: googleTicket['ID'],
    firstName: googleTicket['Prenume'],
    lastName: googleTicket['Nume'],
    email: googleTicket['Email'],
    createdAt: googleTicket['Data Achizitiei'],
    // @ts-ignore
    isAdult: googleTicket['Major(a)'] === 'TRUE',
    // @ts-ignore
    includesAfterParty: googleTicket['Include After Party'] === 'TRUE',
    // @ts-ignore
    hasBeenUsed: googleTicket['Bilet Folosit (Bal)'] === 'TRUE',
    // @ts-ignore
    hasBeenUsedTimestamp: googleTicket['Data Folosirii (Bal)'],
    // @ts-ignore
    hasBeenUsedParty: googleTicket['Bilet Folosit (Party)'] === 'TRUE',
    // @ts-ignore
    hasBeenUsedPartyTimestamp: googleTicket['Data Folosirii (Party)'],
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
    isAdult: 'Major(a)',
    hasBeenUsed: 'Bilet Folosit (Bal)',
    hasBeenUsedParty: 'Bilet Folosit (Party)',
    // hasBeenUsedTimestamp: 'Data Folosirii (Bal)',
    createdAt: 'Data Achizitiei',
    // hasBeenUsedTimestampParty: 'Data Folosirii  (Party)',
    actions: 'Actiuni'
};

