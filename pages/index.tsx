import {useState} from 'react';
import Head from "next/head";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {Alert, Box, Button, Container, Divider} from "@mui/material";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import TicketList from "../components/Ticket/List";
import TicketForm from "../components/Ticket/Form";
import {createTicket, getTickets, TICKET_QUERIES} from "../services/tickets";

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const queryClient = useQueryClient();

    const {
        isLoading,
        error,
        data,
    } = useQuery([TICKET_QUERIES.GET_TICKETS], getTickets);

    const {isLoading: isCreating, mutate } = useMutation(
        createTicket, {
            onSuccess: async () => {
                await queryClient.invalidateQueries([TICKET_QUERIES.GET_TICKETS]);
                setShowForm(false);
            },
        });

    return (
        <>
            <Head>
                <title>Bilete</title>
            </Head>

            <Container sx={{ py: 10 }}>
                {
                    error
                        ? <Alert severity="error">{JSON.stringify(error, null, 2)}</Alert>
                        : <TicketList isLoading={isLoading} tickets={data?.tickets} />
                }
            </Container>

            <Box
                sx={{
                    backdropFilter: 'saturate(110%) blur(3px)',
                    backgroundColor: 'hsla(0,0%,100%,.2)!important',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100vw',
                }}
            >
                <Divider/>
                <Container>
                    <Box sx={{my: 1, px: 1, display: 'flex', justifyContent: 'flex-end'}}>
                        <Button color="inherit" size="large" component="a" href="/api/auth/logout" sx={{ mr: 3 }}>
                            Logout
                        </Button>
                        <Button variant="contained" size="large" onClick={() => setShowForm(true)}>
                            Bilet nou
                        </Button>
                    </Box>
                </Container>
            </Box>

            <TicketForm isOpen={showForm} isLoading={isCreating}
                        onSubmit={mutate} onClose={() => setShowForm(false)} />
        </>
  )
}

export const getServerSideProps = withPageAuthRequired();
