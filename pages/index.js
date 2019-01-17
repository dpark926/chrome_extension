import React, { Component, Fragment } from "react";
import Link from "next/link";
import Crypto from "../components/Crypto";
import Stocks from "../components/Stocks";
import TopNews from "../components/TopNews";
import Weather from "../components/Weather";
import TimeDate from "../components/TimeDate";
import "../styles/styles.scss";

class index extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="everything">
        <div>Homepage</div>
        <div>
          <TimeDate />
        </div>
        <div>
          <Weather />
        </div>
        <div>
          <Crypto />
        </div>
        <div>
          <Stocks />
        </div>
        <div>
          <TopNews />
        </div>
      </div>
    );
  }
}

export default index;
