import React, { Component, Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import Crypto from "../components/Crypto";
import Stocks from "../components/Stocks";
import TopNews from "../components/TopNews";
import Weather from "../components/Weather";
import TimeDate from "../components/TimeDate";
import "../styles/index.scss";

class index extends Component {
  constructor() {
    super();
    this.state = { weatherCityModalOpen: false };
  }

  render() {
    const { weatherCityModalOpen } = this.state;

    return (
      <div
        className="flex bg-black white absolute overflow-hidden col-12"
        style={{ height: "100vh" }}
      >
        <Head>
          <title>Momentum</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="flex-auto">
          <TimeDate />
          <Weather />
          <div className="index-news--container">
            <TopNews />
            <Stocks />
          </div>
        </div>
        <Crypto />
      </div>
    );
  }
}

export default index;
