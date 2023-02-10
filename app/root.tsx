import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./styles/app.css"
import global_styles from "./styles/global.css"

export function links() {
  return [{ rel: "stylesheet", href: styles },{ rel: "stylesheet", href: global_styles }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "This Resume Is a Shopify Store",
  viewport: "width=device-width,initial-scale=1.0",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='mx-auto max-w-4xl'>
          <Outlet />
        </div>
      </body>
    </html>
  );
}
