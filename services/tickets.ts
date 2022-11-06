import axios from "axios";
import {ITicket} from "../models/ticket";

const httpInstance =  axios.create({
    baseURL: '/api',
});

httpInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error && error.response && error.response.data) {
            return Promise.reject(error.response.data.error ? error.response.data.error : error.response.data);
        } else {
            return Promise.reject({ message: 'Server error' });
        }
    }
);

export const TICKET_QUERIES = {
    GET_TICKETS: 'GET_TICKETS'
}

interface IData {
    success: boolean;
    tickets?: ITicket[];
}

export const getTickets = async() : Promise<IData> => {
    return await httpInstance.get('/tickets');
}

export const createTicket = async(ticket: ITicket) : Promise<ITicket> => {
    return await httpInstance.post('/tickets/create', ticket);
}

export const resendEmail = async(ticket: ITicket) : Promise<ITicket> => {
    return await httpInstance.post('/tickets/resend', ticket);
}

// @ts-ignore
export const validateTicket = async({ code, type }) : Promise<ITicket> => {
    return await httpInstance.get('/tickets/verify', { params: { code, type } });
}

export const encodeTicketInfo = (ticket: ITicket): string => {
    return Buffer.from(JSON.stringify(ticket), 'utf8').toString('base64')
}
export const decodeTicketInfo = (encodedTicket: string ): ITicket => {
    try {
        return JSON.parse(Buffer.from(encodedTicket, 'base64').toString('utf8'));
    }
    catch (error) {
        throw new Error('Invalid QR Code')
    }
}
