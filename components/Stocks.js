import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";
import "../styles/stocks.scss";

class Stocks extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    fetch(
      keys.proxyURL +
        `https://${keys.cryptoPanicAPI}?auth_token=${
          keys.cryptoPanicAPIKey
        }&filter=rising`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          cryptoNewsData: data
        })
      )
      .catch(err => console.log(err));
  }

  render() {
    const { cryptoNewsData } = this.state;

    return (
      <div className="col-6">
        {cryptoNewsData &&
          cryptoNewsData.results.map((news, idx) => {
            return (
              <div key={idx} className="stocks-item p1">
                <Link href={news.url}>
                  <a>
                    {news.title}
                    <span className="nowrap">{` - ${news.source.domain}`}</span>
                  </a>
                </Link>
              </div>
            );
          })}
      </div>
    );
  }
}

export default Stocks;
