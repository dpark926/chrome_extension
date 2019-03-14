import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";
import "../styles/crypto.scss";

class Crypto extends Component {
  constructor() {
    super();
    this.state = {
      timeTab: "24h"
    };
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

  selectTimeTab = time => {
    this.setState({ timeTab: time });
  };

  render() {
    const { cryptoData, timeTab } = this.state;
    const { toggleCryptoModal } = this.props;
    let totalValue;
    let gainLoss;

    if (cryptoData) {
      totalValue =
        Math.round(5.41461182 * cryptoData.RAW.ETH.USD.PRICE * 100) / 100;
      gainLoss =
        Math.round((5.41461182 * cryptoData.RAW.ETH.USD.PRICE - 754.02) * 100) /
        100;
    }

    return (
      <div className="crypto bg-dark-gray">
        <div className="time-tab flex">
          <div
            className={`time-tab-item col-4 center pointer p1 ${
              timeTab === "1h" ? "bg-black" : "light-gray"
            }`}
            onClick={() => this.selectTimeTab("1h")}
          >
            1h
          </div>
          <div
            className={`time-tab-item col-4 center pointer p1 ${
              timeTab === "24h" ? "bg-black" : "light-gray"
            }`}
            onClick={() => this.selectTimeTab("24h")}
          >
            24h
          </div>
          <div
            className={`time-tab-item col-4 center pointer p1 ${
              timeTab === "7d" ? "bg-black" : "light-gray"
            }`}
            onClick={() => this.selectTimeTab("7d")}
          >
            7d
          </div>
        </div>
        {cryptoData && (
          <div className="px1">
            <h4 className="m0 pt1 light-gray" onClick={toggleCryptoModal}>
              My Value:{" "}
            </h4>
            <h2 className="m0 pt1">$ {totalValue}</h2>
            <div className={`right-align ${gainLoss < 0 ? "red" : "green"}`}>
              $ {gainLoss}
            </div>
          </div>
        )}
        <div className="py1">
          {cryptoData &&
            Object.keys(cryptoData.DISPLAY).map((token, idx) => {
              return (
                <div className="crypto-item pt1 px1" key={idx}>
                  <div className="flex">
                    <span className="light-gray">{token}</span>
                    <span className="flex-auto right-align nowrap pl2">
                      {cryptoData.DISPLAY[token].USD.PRICE}
                    </span>
                  </div>
                  <div
                    className={`right-align ${
                      cryptoData.DISPLAY[token].USD.CHANGEPCT24HOUR.slice(
                        0,
                        1
                      ) === "-"
                        ? "red"
                        : "green"
                    }`}
                  >
                    {cryptoData ? (
                      <div>{`${
                        cryptoData.DISPLAY[token].USD.CHANGEPCT24HOUR
                      } %`}</div>
                    ) : (
                      "--"
                    )}
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
