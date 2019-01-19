import React, { Component, Fragment } from "react";
import Link from "next/link";
import Crypto from "../components/Crypto";
import Stocks from "../components/Stocks";
import TopNews from "../components/TopNews";
import Weather from "../components/Weather";
import TimeDate from "../components/TimeDate";

class index extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="flex bg-black white">
        <div className="flex-auto">
          <TimeDate />
          <Weather />
          <div className="flex">
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
