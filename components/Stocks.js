import React, { Component, Fragment } from "react";
import Link from "next/link";
import Loader from "react-loader";
import ArrowUpward from "rmdi/lib/ArrowUpward";
import ArrowDownward from "rmdi/lib/ArrowDownward";
import PriorityHigh from "rmdi/lib/PriorityHigh";
import ThumbUp from "rmdi/lib/ThumbUp";
import ThumbDown from "rmdi/lib/ThumbDown";
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
                <div className="flex pt1">
                  {news.votes.liked > 0 && (
                    <div className="flex pr2 green">
                      <ArrowUpward size={18} color="green" />
                      {news.votes.liked}
                    </div>
                  )}
                  {news.votes.important > 0 && (
                    <div className="flex pr2 yellow">
                      <PriorityHigh size={18} color="#daff00" />
                      {news.votes.important}
                    </div>
                  )}
                  {news.votes.disliked > 0 && (
                    <div className="flex pr2 orange">
                      <ArrowDownward size={18} color="#ffa500" />
                      {news.votes.disliked}
                    </div>
                  )}
                  {news.votes.positive > 0 && (
                    <div className="flex pr2 blue">
                      <ThumbUp size={18} color="#23a8c3" />
                      <span className="pl1">{news.votes.positive}</span>
                    </div>
                  )}
                  {news.votes.negative > 0 && (
                    <div className="flex pr2 red">
                      <ThumbDown size={18} color="#b70519" />
                      <span className="pl1">{news.votes.negative}</span>
                    </div>
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
