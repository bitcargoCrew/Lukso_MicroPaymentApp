const dev = process.env.NODE_ENV !== 'production';

const config = {
  apiUrl: dev ? 'http://localhost:3001' : 'https://lukso-micropaymentapp-1.onrender.com',
};

export default config;