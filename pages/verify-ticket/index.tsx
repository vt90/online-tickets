import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from "next/router";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import {Alert, Box, Button, Container, Divider, Typography} from '@mui/material';
import {useMutation } from '@tanstack/react-query';
import ListLoadingIndicator from "../../components/ListLoadingIndcator";
import {validateTicket} from "../../services/tickets";

export default function VerifyTicket() {
    const router = useRouter();
    const { code } = router.query;

    const {isLoading, mutate, error } = useMutation(validateTicket);

    useEffect(() => {
        mutate(`${code}`);
    }, [code, mutate])

    return (
        <>
            <Head>
                <title>Verificare bilet</title>
            </Head>

            <Container sx={{ py: 10 }}>
                {
                    isLoading
                        ? (<ListLoadingIndicator />)
                        : (
                            <>
                                {
                                    error
                                        // @ts-ignore
                                        ? <Alert sx={{ boxShadow: 5, py: 3 }} severity="error">{error}</Alert>
                                        : <Alert sx={{ boxShadow: 5, py: 3 }} severity="success">Biletul este valid!</Alert>
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
