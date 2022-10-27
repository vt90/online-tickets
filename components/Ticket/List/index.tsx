import React, { Fragment } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import {ITicket, TICKET_KEY_NAME_PAIR} from "../../../models/ticket";
import ListLoadingIndicator from "../../ListLoadingIndcator";
import TicketListItem from "./Item";


interface ITicketListProps {
    isLoading: boolean;
    tickets: ITicket[] | undefined;
}

interface ICustomTableContainer {
    header: React.ReactNode,
    children: React.ReactNode,
}

const CustomTableContainer = (props: ICustomTableContainer) => {
    const { children, header } = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }}>
                {header}
                <TableBody>
                    {children}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const TicketList = (props: ITicketListProps) => {
    const {
        isLoading,
        tickets,
    } = props;

    const isSmallDevice = useMediaQuery('(max-width:960px)', { noSsr: true });

    if (isLoading) return <ListLoadingIndicator />;

    const Container = isSmallDevice ? Fragment : CustomTableContainer;

    const containerProps = {
        ...(!isSmallDevice && {
            header: (
                <TableHead>
                    <TableRow>
                        {Object.values(TICKET_KEY_NAME_PAIR).map((title, index) => (
                            <TableCell key={title} align={index ? 'right' : 'left'}>
                                <Typography variant="body2">
                                    {title}
                                </Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
            ),
        })
    };

    return  tickets?.length
        // @ts-ignore
        ? <Container {...containerProps}>
            {tickets.map((ticket) => {
                return (
                    <TicketListItem
                        isSmallDevice={isSmallDevice}
                        key={ticket._id}
                        ticket={ticket}
                    />
                );
            })}
        </Container>
        : <Typography>Niciun bilet</Typography>;
}

export default TicketList;
