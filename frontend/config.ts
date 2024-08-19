import { PinataSDK } from "pinata"

const dev = process.env.NODE_ENV !== 'production';

export const config = {
  apiUrl: dev ? 'http://localhost:3001' : 'https://lukso-micropaymentapp-1.onrender.com',
};

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.NEXT_PUBLIC_API_JWT_PINATA}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
  pinataGatewayKey: `${process.env.NEXT_PUBLIC_GATEWAY_KEY_PINAT}`
})