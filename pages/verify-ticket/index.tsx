import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from "next/router";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Alert, Container, Typography } from '@mui/material';
import {useMutation } from '@tanstack/react-query';
import ListLoadingIndicator from "../../components/ListLoadingIndcator";
import {validateTicket} from "../../services/tickets";

const INITIAL_VALUES = {
    firstName: 'Vlad',
    lastName: 'Tomsa',
    email: 'tomsavlad90@gmail.com'
};

export default function VerifyTicket() {
    const router = useRouter();
    const { code } = router.query;

    const {isLoading, mutate, error, data } = useMutation(validateTicket);

    useEffect(() => {
        mutate(`${code}`);
    }, [code])

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
        </>
    )
}
