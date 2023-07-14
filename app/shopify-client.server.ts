import {createStorefrontClient} from '@shopify/hydrogen-react';

const client = createStorefrontClient({
  publicStorefrontToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
  storeDomain: process.env.SHOPIFY_STOREFRONT_ID,
  storefrontApiVersion: '2023-07',
  contentType: 'graphql',
});



export const getStorefrontApiUrl = client.getStorefrontApiUrl;
export const getPublicTokenHeaders = client.getPublicTokenHeaders;


