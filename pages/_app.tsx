import React from 'react';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {UserProvider} from '@auth0/nextjs-auth0';
import {CacheProvider} from '@emotion/react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {theme, createEmotionCache} from "../lib/theme";
import '../styles/globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// Create a client
const queryClient = new QueryClient()

function MyApp(props: AppProps) {
    // @ts-ignore
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

    return (
        <QueryClientProvider client={queryClient}>
            <CacheProvider value={emotionCache}>
                <UserProvider>
                    <Head>
                        <meta name="viewport" content="initial-scale=1, width=device-width"/>

                        <title>Bilete</title>
                    </Head>
                    <ThemeProvider theme={theme}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline/>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </UserProvider>
            </CacheProvider>
        </QueryClientProvider>
    );
}

export default MyApp
