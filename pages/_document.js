// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Head, Main, NextScript } from "next/document";
import "../styles/styles.scss";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html className="bg-black">
        <Head>
          <style>{`body { margin: 0 } /* custom! */`}</style>
          <link
            href="https://unpkg.com/basscss@8.0.2/css/basscss.min.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Inconsolata:400,700"
            rel="stylesheet"
          />
        </Head>
        <body className="custom_class inconsolata">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
