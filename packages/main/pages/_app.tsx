// import type { AppProps } from 'next/app'
// import {Body} from '../styles/styledComponents'
//
// function MyApp({ Component, pageProps }: AppProps) {
//   return <Body><Component {...pageProps} /></Body>
// }

import React from 'react';
import Head from 'next/head';
// MUI Core
import {ThemeProvider as MaterialUiThemeProvider} from '@mui/styles';
import {ThemeProvider as StyledThemeProvider} from 'styled-components';
// Utils
import {theme} from '../common/theme';
import {global as GlobalStyles} from '../common/global';
import '../styles/globals.css'
import '../styles/printPages.css'
import wrapper from '../store'

const App = ({ Component, pageProps, store }: any) => {
  return (
    <React.Fragment>
      <Head>
        <title>MES</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <MaterialUiThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <GlobalStyles />
          <Component {...pageProps} />
        </StyledThemeProvider>
      </MaterialUiThemeProvider>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ ctx, Component }: any) => {
  const pageProps = await Component.getStaticProps?.(ctx);
  return { props: { ...pageProps } }
}

export const getInitialProps = async ({ Component, router, ctx }: any) => {
  let pageProps = { };
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
}

export default wrapper.withRedux(App)

