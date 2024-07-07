// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';
import axios from 'axios';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const setupSocket = async () => {
      await axios.get('/api/socket');
    };

    setupSocket();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
