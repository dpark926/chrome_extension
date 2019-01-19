import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";
import "../styles/crypto.scss";

class Crypto extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    fetch(`https://${keys.cryptoCompareAPI}`)
      .then(response => response.json())
      .then(data =>
        this.setState({
          cryptoData: data
        })
      )
      .catch(err => console.log(err));
  }

  render() {
    const { cryptoData } = this.state;
    let totalValue;
    let gainLoss;

    if (cryptoData) {
      totalValue = Math.round(5.61712285 * cryptoData.ETH.USD * 100) / 100;
      gainLoss =
        Math.round((5.61712285 * cryptoData.ETH.USD - 720) * 100) / 100;
    }

    return (
      <div className="crypto">
        <div className="time-tab flex">
          <div className={`col-4 center p1 ${false ? "white" : "light-gray"}`}>
            1h
          </div>
          <div className={`col-4 center p1 ${false ? "white" : "light-gray"}`}>
            24hr
          </div>
          <div className={`col-4 center p1 ${false ? "white" : "light-gray"}`}>
            7d
          </div>
        </div>
        {cryptoData && (
          <div className="px1">
            <h4 className="m0 pt1 light-gray">My Value: </h4>
            <h2 className="m0 pt1">$ {totalValue}</h2>
            <div className={`right-align ${gainLoss < 0 ? "red" : "green"}`}>
              $ {gainLoss}
            </div>
          </div>
        )}
        <div className="py1">
          {cryptoData &&
            Object.keys(cryptoData).map((token, idx) => {
              return (
                <div className="crypto-item pt1 px1" key={idx}>
                  <div className="flex">
                    <span className="light-gray">{token}</span>
                    <span className="flex-auto right-align pl2">
                      $ {cryptoData[token].USD}
                    </span>
                  </div>
                  <div
                    className={`right-align ${gainLoss < 0 ? "red" : "green"}`}
                  >
                    --
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Crypto;
