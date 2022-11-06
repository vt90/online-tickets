import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from "next/router";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import {Alert, Box, Button, Card, Container, Divider, Typography} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import ListLoadingIndicator from "../../components/ListLoadingIndcator";
import {decodeTicketInfo, getTickets, TICKET_QUERIES, validateTicket} from "../../services/tickets";
import moment from "moment/moment";

export default function VerifyTicket() {
    const [codeError, setCodeError] = useState('');
    const [codeInfo, setCodeInfo] = useState({});
    const router = useRouter();
    const { code } = router.query;
    const queryClient = useQueryClient();

    const {
        isLoading: isTicketsLoading,
        error: ticketsError,
        data: tickets,
    } = useQuery([TICKET_QUERIES.GET_TICKETS], getTickets);

    const {isLoading, mutate, error } = useMutation(validateTicket, {
        onSuccess: async () => {
            await queryClient.invalidateQueries([TICKET_QUERIES.GET_TICKETS]);
        },
    });

    useEffect(() => {
        // @ts-ignore
        const qrInfo = code && decodeTicketInfo(code);

        if (tickets) {
            // @ts-ignore
            if (!qrInfo?.['_id']) setCodeError('Bilet invalid');

            // @ts-ignore
            const qrInfoDetails = tickets?.tickets?.find((t) => t['_id'] === qrInfo['_id']);

            if (qrInfoDetails) {
                setCodeInfo(qrInfoDetails);
            }
            else {
                setCodeError('Bilet invalid');
            }
        }
    }, [tickets, code])

    return (
        <>
            <Head>
                <title>Verificare bilet</title>
            </Head>

            <Container sx={{ py: 10 }}>
                <Card sx={{ mb:2  }}>
                    <Box sx={{ px: 3, py: 2 }}>
                        <Typography variant="h6">
                            <strong>Informatii bilet</strong>
                        </Typography>
                    </Box>
                    <Divider></Divider>
                    <Box sx={{ px: 3, py: 2 }}>
                        <Typography color="textSecondary" gutterBottom>
                            {/* @ts-ignore */}
                            {codeInfo?.firstName} {codeInfo?.lastName}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {/* @ts-ignore */}
                            Biletul {codeInfo?.includesAfterParty ? 'include' : <strong>NU INCLUDE</strong>} intrare after party
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {/* @ts-ignore */}
                            Persoana {codeInfo?.isAdult ? 'majora' : <strong>MINORA</strong>} intrare after party
                        </Typography>
                    </Box>
                </Card>
                {
                    isLoading || isTicketsLoading
                        ? (<ListLoadingIndicator />)
                        : (
                            <>
                                 {
                                    // @ts-ignore
                                    codeInfo?.hasBeenUsedParty && codeInfo?.includesAfterParty
                                        // @ts-ignore
                                        ? <Alert sx={{ boxShadow: 5, py: 3, mb: 2 }} severity="error">Bilet party folosit in: {moment(codeInfo?.hasBeenUsedPartyTimestamp).format('YYYY.MM.DD HH:mm')}</Alert>
                                        : (
                                            <Button
                                                size="large"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => mutate({
                                                    code: `${code}`,
                                                    type: 'Party'
                                                })}
                                                sx={{
                                                    my: 2,
                                                    mr: 2
                                                }}
                                            >
                                                Semneaza intrare party
                                            </Button>
                                        )
                                }


                                {
                                    // @ts-ignore
                                    codeInfo?.hasBeenUsed
                                        // @ts-ignore
                                        ? <Alert sx={{ boxShadow: 5, py: 3, mb: 2 }} severity="error">Bilet bal folosit in: {moment(codeInfo?.hasBeenUsedTimestamp).format('YYYY.MM.DD HH:mm')}</Alert>
                                        : (
                                            <Button
                                                size="large"
                                                variant="contained"
                                                onClick={() => mutate({
                                                    code: `${code}`,
                                                    type: 'Bal'
                                                })}
                                                sx={{
                                                    my: 2,
                                                    mr: 2
                                                }}
                                            >
                                                Semneaza intrare bal
                                            </Button>
                                        )
                                }

                                {
                                    error || codeError
                                        // @ts-ignore
                                        ? <Alert sx={{ boxShadow: 5, py: 3, mb: 2 }} severity="error">{error || codeError}</Alert>
                                        : <Alert sx={{ boxShadow: 5, py: 3, mb: 2 }} severity="success">Biletul este valid!</Alert>
                                }





                                <Link href="/">
                                    <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ mt: 6, cursor: 'pointer' }}>
                                        <ArrowBackOutlinedIcon /> Inapoi la bilete
                                    </Typography>
                                </Link>
                            </>
                        )
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
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export const getServerSideProps = withPageAuthRequired();
