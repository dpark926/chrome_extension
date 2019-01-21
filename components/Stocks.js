import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";
import "../styles/stocks.scss";
import Loader from "react-loader";

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

    console.log(cryptoNewsData);

    return (
      <div className="col-6">
        {!cryptoNewsData && (
          <div className="relative p4">
            <Loader color="#fff" />
          </div>
        )}
        {cryptoNewsData &&
          cryptoNewsData.results.map((news, idx) => {
            return (
              <div key={idx} className="stocks-item p1">
                <Link href={news.url}>
                  <a target="_blank">
                    {news.title}
                    <span className="nowrap">{` - ${news.source.domain}`}</span>
                  </a>
                </Link>
                <div>
                  {news.votes.liked > 0 && (
                    <span className="pr2 green">{news.votes.liked}</span>
                  )}
                  {news.votes.important > 0 && (
                    <span className="pr2">{news.votes.important}</span>
                  )}
                  {news.votes.disliked > 0 && (
                    <span className="pr2 red">{news.votes.disliked}</span>
                  )}
                  {news.votes.positive > 0 && (
                    <span className="pr2 blue">{news.votes.positive}</span>
                  )}
                  {news.votes.negative > 0 && (
                    <span className="pr2 red">{news.votes.negative}</span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}

export default Stocks;
