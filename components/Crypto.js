import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";

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

    return (
      <div>
        <h1>Crypto</h1>
        {cryptoData &&
          Object.keys(cryptoData).map((token, idx) => {
            return (
              <div key={idx}>
                {token}: $ {cryptoData[token].USD}
              </div>
            );
          })}
      </div>
    );
  }
}

export default Crypto;
