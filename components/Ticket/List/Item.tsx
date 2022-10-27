import React, { Fragment } from 'react';
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import {ITicket, TICKET_KEY_NAME_PAIR} from "../../../models/ticket";
import {resendEmail} from "../../../services/tickets";
import {useMutation} from "@tanstack/react-query";


interface ITicketListItemProps {
    ticket: ITicket | undefined;
    isSmallDevice: boolean;
}
const TicketListItem = (props: ITicketListItemProps) => {
    const {
        isSmallDevice,
        ticket,
    } = props;

    // Mutations
    const {isLoading, mutate} = useMutation(resendEmail);


    const renderTicketValue = (key: string, ticket: ITicket | undefined) => {
        if (!ticket) return null;

        switch (key) {
            case 'name':
                return <Typography>{ticket.firstName} {ticket.lastName}</Typography>;
            case 'createdAt':
            case 'hasBeenUsedTimestamp':
                // @ts-ignore
                return <Typography color="textSecondary">{ticket[key] && moment(ticket[key]).format('YYYY.MM.DD HH:mm')}</Typography>;
            case 'hasBeenUsed':
                return <Typography color="textSecondary">{ticket[key] ? <CheckCircleIcon /> : <CloseIcon />}</Typography>;
            case 'actions':
                return (
                    <LoadingButton
                        variant="contained"
                        loadingPosition="end"
                        loading={isLoading}
                        disabled={ticket.hasBeenUsed}
                        onClick={() => mutate(ticket)}
                        endIcon={<SendIcon />}
                    >
                        Retrimite email
                    </LoadingButton>
                );
            default:
                // @ts-ignore
                return <Typography color="textSecondary">{ticket[key]}</Typography>;
        }
    }

    return  isSmallDevice
        ? (
            <Paper sx={{ mb: 3 }}>
                <Box p={3}>
                    {Object.keys(TICKET_KEY_NAME_PAIR).map((key, index) => (
                        <Fragment key={key}>
                            <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="textSecondary">
                                    {/*  @ts-ignore */}
                                    {TICKET_KEY_NAME_PAIR[key]}
                                </Typography>

                                <Box>
                                    {renderTicketValue(key, ticket)}
                                </Box>
                            </Box>
                            {(index < Object.keys(TICKET_KEY_NAME_PAIR).length - 1) && <Divider />}
                        </Fragment>
                    ))}
                </Box>
            </Paper>
        )
        : (
            <TableRow
                sx={{
                    '&:last-child td, &:last-child th': { border: 0 } ,
                    ...(ticket?.hasBeenUsed && {
                        bgcolor: 'action.selected',
                    })
                }}
            >
                {Object.keys(TICKET_KEY_NAME_PAIR).map((key, index) => (
                    <TableCell key={key} align={index ? 'right' : 'left'}>
                        {renderTicketValue(key, ticket)}
                    </TableCell>
                ))}
            </TableRow>
        );
}

export default TicketListItem;
