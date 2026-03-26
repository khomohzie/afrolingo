import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="light">
      <Head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />

        <script src="https://newwebpay.qa.interswitchng.com/inline-checkout.js"></script>
      </body>
    </Html>
  );
}
