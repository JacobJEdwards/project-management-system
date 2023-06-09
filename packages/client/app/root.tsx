import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

import Footer from "./components/Footer";

import type { PropsWithChildren } from "react";
import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";

import tailwindURL from "./styles/app.css";

// linking css
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindURL }];
};

// site wide meta tags
export const meta: V2_MetaFunction = () => {
  return [{ description: "Interview Web App" }];
};

const Layout = ({
  children,
}: PropsWithChildren<{ title?: string; loadUser?: boolean }>) => {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Layout title="Oops!">
        <main className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold text-gray-900">Oops!</h1>
          <p className="text-gray-700">Something went wrong</p>
          {error.data?.message && (
            <pre className="text-sm text-gray-500">{error.data.message}</pre>
          )}
        </main>
      </Layout>
    );
  }

  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  return (
    <Layout title="Oops!" loadUser={false}>
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-gray-900">Oops!</h1>
        <p className="text-gray-700">{errorMessage}</p>
      </main>
    </Layout>
  );
}
