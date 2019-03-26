import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";
import "../styles/crypto.scss";

class Crypto extends Component {
  constructor() {
    super();
    this.state = {
      timeTab: "24h",
      cryptoModalOpen: false
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

  toggleCryptoModal = () => {
    const { cryptoModalOpen } = this.state;
    this.setState({ cryptoModalOpen: !cryptoModalOpen });
  };

  render() {
    const { cryptoData, timeTab, cryptoModalOpen } = this.state;
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
      <div className="crypto bg-dark-gray" style={{ width: "160px" }}>
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
            <h4 className="m0 pt1 light-gray" onClick={this.toggleCryptoModal}>
              My Value:{" "}
            </h4>
            <h2 className="m0 pt1">$ {totalValue}</h2>
            <div className={`right-align ${gainLoss < 0 ? "red" : "green"}`}>
              $ {gainLoss}
            </div>
          </div>
        )}
        <div
          className="absolute"
          style={{
            height: "calc(100vh - 110px)",
            width: "160px"
          }}
        >
          <div className="overflow-scroll" style={{ height: "100%" }}>
            <div className="py1">
              {cryptoData &&
                Object.keys(cryptoData.DISPLAY).map((token, idx) => {
                  return (
                    <div className="crypto-item pt1 px1" key={idx}>
                      <div className="flex">
                        <div className="col-4">
                          <span className="light-gray">{token}</span>
                        </div>
                        {cryptoModalOpen ? (
                          <div className="flex flex-column col-8">
                            <input
                              className="crypto-input bg-dark-gray rounded white px1 h6"
                              type="text"
                              name="btc"
                              placeholder="Price"
                              autoComplete="off"
                            />
                            <input
                              className="crypto-input bg-dark-gray rounded white px1 h6"
                              type="text"
                              name="btc"
                              placeholder="Amount"
                              autoComplete="off"
                            />
                          </div>
                        ) : (
                          <div className="flex-auto col-8">
                            <div className="right-align nowrap pl2">
                              {cryptoData.DISPLAY[token].USD.PRICE}
                            </div>
                            <div
                              className={`right-align ${
                                cryptoData.DISPLAY[
                                  token
                                ].USD.CHANGEPCT24HOUR.slice(0, 1) === "-"
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
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Crypto;
