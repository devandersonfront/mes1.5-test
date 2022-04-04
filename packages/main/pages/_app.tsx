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
import withRedux from 'next-redux-wrapper'
import {applyMiddleware, compose, createStore} from 'redux';
import reducer from '../reducer';

// Redux
// import { composeWithDevTools } from 'redux-devtools-extension';
// import { applyMiddleware, createStore } from 'redux';
// import { Provider } from 'react-redux';
// import reducer from "../src/modules";
// import Cookies from 'js-cookie';
// import ThemeToggleBtn from "../src/components/ThemeToggleBtn";
// const store = createStore(reducer, composeWithDevTools(applyMiddleware()))
import '../styles/globals.css'
import {composeWithDevTools} from 'redux-devtools-extension'

const App = ({ Component, pageProps, store }: any) => {
  return (
    <React.Fragment>
        {/*<MaterialUiThemeProvider theme={theme}>*/}
        {/*  <StyledThemeProvider theme={theme}>*/}
        <Head>
          <title>MES</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
            {/*<GlobalStyles />*/}
            <Component {...pageProps} />
          {/*</StyledThemeProvider>*/}
        {/*</MaterialUiThemeProvider>*/}
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

const configureStore = (initialState, options) => {
  const middlewares = []
  const enhancer = process.env.NODE_ENV === 'production' ?
    compose(applyMiddleware(...middlewares)) :
    composeWithDevTools(
      applyMiddleware(...middlewares)
    );

  const store = createStore(reducer, initialState, enhancer);
  return store;
}

// @ts-ignore
export default withRedux(configureStore)(App)

