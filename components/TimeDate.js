import React, { Component, Fragment } from "react";
import Link from "next/link";
import Lock from "rmdi/lib/Lock";
import Close from "rmdi/lib/Close";
import { Months, Days } from "../src/date";

class TimeDate extends Component {
  constructor() {
    super();
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    const interval = setInterval(() => {
      this.updateTime();
    }, 60000);

    this.setState({ interval: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  updateTime = () => {
    const d = new Date();
    this.setState({ time: d });
  };

  renderDate = () => {
    const { time } = this.state;

    return (
      <div className="light-gray">{`${Days[time.getDay()].abv}, ${
        Months[time.getMonth()].abv
      }. ${time.getDate()}, ${time.getFullYear()}`}</div>
    );
  };

  renderTime = () => {
    const { time } = this.state;
    const isHourSingle =
      time.getHours() % 12 < 10 && time.getHours() !== 0 ? "0" : "";
    const isMinuteSingle = time.getMinutes() < 10 ? "0" : "";
    const isAM = time.getHours() < 11;

    return (
      <div>
        {`${isHourSingle}${
          time.getHours() % 12 === 0 ? "12" : time.getHours() % 12
        }:${isMinuteSingle}${time.getMinutes()} ${isAM ? "AM" : "PM"}`}
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
            <div
              className="absolute col-12 bg-dark-gray light-gray py4 px3 border rounded z2"
              style={{ maxWidth: "250px" }}
            >
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
