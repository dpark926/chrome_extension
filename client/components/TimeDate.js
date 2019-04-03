import React, { Component, Fragment } from "react";
import Link from "next/link";
import Lock from "rmdi/lib/Lock";
import Close from "rmdi/lib/Close";
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

  toggleModal = e => {
    const { modalOpen } = this.state;
    this.setState({ modalOpen: !modalOpen });
  };

  render() {
    const { modalOpen } = this.state;

    return (
      <div className="flex m1">
        <div>
          <span className="h2">{this.renderTime()}</span>
          {this.renderDate()}
        </div>
        <div className="flex flex-auto justify-end">
          <div className="m1 px2 py1 border rounded pointer light-gray hover-white">
            Sign Up
          </div>
          <div
            className="m1 p1 pointer light-gray hover-white"
            onClick={this.toggleModal}
          >
            Login
          </div>
        </div>
        {modalOpen && (
          <div
            className="absolute col-12 flex flex-column justify-center items-center bg-modal light-gray z1"
            style={{ height: "100%", top: 0, left: 0 }}
          >
            <div className="absolute bg-dark-gray light-gray py3 px4 border rounded z2">
              <Close
                className="absolute pointer hover"
                size={24}
                color="white"
                style={{ top: "10px", right: "10px" }}
                onClick={this.toggleModal}
              />
              <div className="center">
                <Lock size={64} color="white" />
                <h2 className="white">Login</h2>
              </div>
              <form className="flex flex-column z2">
                <input
                  className="my1 p1 rounded border-none"
                  type="email"
                  placeholder="Email"
                />
                <input
                  className="my1 p1 rounded border-none"
                  type="password"
                  placeholder="Password"
                />
                <input
                  className="white pointer bg-blue border-none rounded hover my1 p1"
                  type="submit"
                  value="Login"
                />
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TimeDate;
