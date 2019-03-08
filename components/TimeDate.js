import React, { Component, Fragment } from "react";
import Link from "next/link";
import { Months, Days } from "../src/date";

class TimeDate extends Component {
  constructor() {
    super();
    let d = new Date();
    this.state = {
      day: d.getDay(),
      month: d.getMonth(),
      date: d.getDate(),
      year: d.getFullYear(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds()
    };
  }

  renderDate = () => {
    const { day, month, date, year } = this.state;

    return (
      <div className="light-gray">{`${Days[day].abv}, ${
        Months[month].abv
      }. ${date}, ${year}`}</div>
    );
  };

  renderTime = () => {
    const { hour, minute, second } = this.state;
    const isHourSingle = hour % 12 < 10 && hour !== 0 ? "0" : "";
    const isMinuteSingle = minute < 10 ? "0" : "";
    const isAM = hour < 11;

    return (
      <div>
        {`${isHourSingle}${
          hour % 12 === 0 ? "12" : hour % 12
        }:${isMinuteSingle}${minute} ${isAM ? "AM" : "PM"}`}
      </div>
    );
  };

  render() {
    return (
      <div className="m1">
        <span className="h2">{this.renderTime()}</span>
        {this.renderDate()}
      </div>
    );
  }
}

export default TimeDate;
