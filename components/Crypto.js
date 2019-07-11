import React, { Component, Fragment } from "react";
import Link from "next/link";
import Settings from "rmdi/lib/Settings";
import { keys } from "../config/keys";
import { formatMoney } from "../utils/functions";
import "../styles/crypto.scss";

class Crypto extends Component {
  state = {
    timeTab: "24h",
    portfolio: {
      BTC: { "BTC-price": "5272.72", "BTC-amount": "0.09459123" },
      LTC: { "LTC-price": "91.71", "LTC-amount": "3.84112230" }
    }
  };

  componentDidMount() {
    this.getCryptoData();

    const interval = setInterval(() => {
      this.getCryptoData();
    }, 30000);

    this.setState({ interval: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  getCryptoData = () => {
    fetch(`https://${process.env.cryptoCompareAPI}`)
      .then(response => response.json())
      .then(data =>
        this.setState({
          cryptoData: data
        })
      )
      .then(this.onSubmit)
      .catch(err => console.log(err));
  };

  selectTimeTab = time => {
    this.setState({ timeTab: time });
  };

  toggleCryptoModal = () => {
    const { cryptoModalOpen } = this.state;
    this.setState({ cryptoModalOpen: !cryptoModalOpen });
  };

  handleChange = e => {
    const { portfolio } = this.state;
    const clone = Object.assign({}, portfolio);
    const token = e.target.name.split("-")[0];

    if (clone[token]) {
      clone[token][e.target.name] = e.target.value;
    } else {
      clone[token] = { [e.target.name]: e.target.value };
    }

    this.setState({ portfolio: clone });
  };

  onSubmit = () => {
    const { cryptoData, portfolio } = this.state;
    let totalValue = 0;
    let gainLoss = 0;

    if (cryptoData && portfolio) {
      for (let key in portfolio) {
        const priceKey = key + "-price";
        const amountKey = key + "-amount";
        const tokenPrice = parseFloat(portfolio[key][priceKey]);
        const tokenAmount = parseFloat(portfolio[key][amountKey]);
        const currentTokenPrice = cryptoData.RAW[key].USD.PRICE;

        if (tokenPrice && tokenAmount) {
          totalValue += Math.round(tokenAmount * currentTokenPrice * 100) / 100;
          gainLoss +=
            Math.round(
              (tokenAmount * currentTokenPrice - tokenAmount * tokenPrice) * 100
            ) / 100;
        } else {
          return false;
        }
      }
    }

    this.setState({
      totalValue: Math.round(totalValue * 100) / 100,
      gainLoss: gainLoss,
      cryptoModalOpen: false
    });
  };

  render() {
    const {
      totalValue,
      gainLoss,
      cryptoData,
      timeTab,
      cryptoModalOpen,
      portfolio
    } = this.state;

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
            <div className="flex items-center">
              <h4 className="flex-auto m0 pt1 light-gray">My Value: </h4>
              <Settings
                className="pt1 pointer hover"
                size={18}
                color="lightgray"
                onClick={this.toggleCryptoModal}
              />
            </div>
            <h2 className="m0 pt1">$ {formatMoney(totalValue)}</h2>
            <div className={`right-align ${gainLoss < 0 ? "red" : "green"}`}>
              $ {formatMoney(gainLoss)}
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
                              className="bg-dark-gray border-divider right-align rounded white px1 h6"
                              type="text"
                              name={`${token}-price`}
                              placeholder={
                                portfolio[token]
                                  ? "$ " + portfolio[token][`${token}-price`]
                                  : "Price"
                              }
                              onChange={this.handleChange}
                              autoComplete="off"
                            />
                            <input
                              className="bg-dark-gray border-divider right-align rounded white px1 h6"
                              type="text"
                              name={`${token}-amount`}
                              placeholder={
                                portfolio[token]
                                  ? portfolio[token][`${token}-amount`]
                                  : "Amount"
                              }
                              onChange={this.handleChange}
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
        {cryptoModalOpen && (
          <div
            className="absolute col-12 py1 flex flex-column bg-dark-gray"
            style={{ width: "160px", bottom: 0 }}
          >
            <button
              className="mx1 mb1 white pointer bg-dark-gray py1 rounded hover"
              onClick={this.toggleCryptoModal}
            >
              Cancel
            </button>
            <button
              className="mx1 white pointer bg-blue border-none py1 rounded hover"
              onClick={this.onSubmit}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Crypto;
