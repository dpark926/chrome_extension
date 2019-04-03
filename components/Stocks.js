import React, { Component, Fragment } from "react";
import Link from "next/link";
import Loader from "react-loader";
import ControlPoint from "rmdi/lib/ControlPoint";
import Delete from "rmdi/lib/Delete";
import ArrowUpward from "rmdi/lib/ArrowUpward";
import ArrowDownward from "rmdi/lib/ArrowDownward";
import ReportProblem from "rmdi/lib/ReportProblem";
import ThumbUp from "rmdi/lib/ThumbUp";
import ThumbDown from "rmdi/lib/ThumbDown";
import { keys } from "../config/keys";
import "../styles/stocks.scss";
import axios from "axios";

class Stocks extends Component {
  constructor() {
    super();
    this.state = { financeTab: "crypto", goalsToday: [], goalsTomorrow: [] };
  }

  componentDidMount() {
    fetch(
      keys.proxyURL +
        `https://${keys.cryptoPanicAPI}?auth_token=${
          keys.cryptoPanicAPIKey
        }&filter=rising`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          cryptoNewsData: data
        })
      )
      .catch(err => console.log(err));

    axios(keys.db)
      .then(res => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        console.log(tomorrow);
        const goalsToday = res.data.filter(task => {
          return (
            new Date(task.goalDate).toString().slice(0, 15) ===
            today.toString().slice(0, 15)
          );
        });

        const goalsTomorrow = res.data.filter(task => {
          return (
            new Date(task.goalDate).toString().slice(0, 15) ===
            tomorrow.toString().slice(0, 15)
          );
        });

        this.setState({
          goalsToday: goalsToday,
          goalsTomorrow: goalsTomorrow
        });
      })
      .catch(err => console.log(err));
  }

  selectFinanceTab = category => {
    this.setState({ financeTab: category });
  };

  toggleGoalModal = type => {
    const { todayModalOpen, tomorrowModalOpen } = this.state;

    switch (type) {
      case "today":
        this.setState({ todayModalOpen: !todayModalOpen });
        break;
      case "tomorrow":
        this.setState({ tomorrowModalOpen: !tomorrowModalOpen });
        break;
      default:
        return;
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.value);
  };

  handleSubmit = type => {
    const { goalsToday, goalsTomorrow, newGoal } = this.state;
    let clone = [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    switch (type) {
      case "today":
        clone = goalsToday.slice();
        axios
          .post(keys.db, {
            name: newGoal,
            goalDate: today.toString().slice(0, 15)
          })
          .then(res =>
            this.setState({ goalsToday: [...goalsToday, res.data] })
          );
        break;
      case "tomorrow":
        clone = goalsTomorrow.slice();
        axios
          .post(keys.db, {
            name: newGoal,
            goalDate: tomorrow.toString().slice(0, 15)
          })
          .then(res =>
            this.setState({ goalsTomorrow: [...goalsTomorrow, res.data] })
          );
        break;
      default:
        return;
    }
    this.toggleGoalModal(type);
  };

  handleDelete = (type, id) => {
    const { goalsToday, goalsTomorrow } = this.state;

    let clone = [];
    let newClone = [];

    switch (type) {
      case "today":
        clone = goalsToday.slice();
        newClone = clone.filter(goal => {
          return goal._id !== id;
        });
        axios
          .delete(`http://localhost:3001/api/tasks/${id}`)
          .then(res => this.setState({ goalsToday: newClone }));
        break;
      case "tomorrow":
        clone = goalsTomorrow.slice();
        newClone = clone.filter(goal => {
          return goal._id !== id;
        });
        axios
          .delete(`http://localhost:3001/api/tasks/${id}`)
          .then(res => this.setState({ goalsTomorrow: newClone }));
        break;
      default:
        return;
    }
  };

  render() {
    const {
      cryptoNewsData,
      financeTab,
      todayModalOpen,
      tomorrowModalOpen,
      goalsToday,
      goalsTomorrow
    } = this.state;

    console.log(this.state);

    return (
      <div className="col-6 relative">
        <div className="finance-tab flex">
          <div
            className={`finance-tab-item col-6 center pointer p1 ${
              financeTab === "crypto" ? "bg-dark-gray" : "bg-black light-gray"
            }`}
            onClick={() => this.selectFinanceTab("crypto")}
          >
            Cryto
          </div>
          <div
            className={`finance-tab-item col-6 center pointer p1 ${
              financeTab === "stocks" ? "bg-dark-gray" : "bg-black light-gray"
            }`}
            onClick={() => this.selectFinanceTab("stocks")}
          >
            Stocks
          </div>
          <div
            className={`finance-tab-item col-6 center pointer p1 ${
              financeTab === "goals" ? "bg-dark-gray" : "bg-black light-gray"
            }`}
            onClick={() => this.selectFinanceTab("goals")}
          >
            Goals
          </div>
        </div>
        {!cryptoNewsData && (
          <div className="relative p4">
            <Loader color="#fff" />
          </div>
        )}
        <div
          className="absolute col-12"
          style={{ height: "calc(100vh - 260px)" }}
        >
          <div className="overflow-scroll" style={{ height: "100%" }}>
            {cryptoNewsData &&
              financeTab === "crypto" &&
              cryptoNewsData.results.map((news, idx) => {
                return (
                  <div key={idx} className="stocks-item p1">
                    <Link href={news.url}>
                      <a target="_blank">
                        {news.title}
                        <span className="nowrap">{` - ${
                          news.source.domain
                        }`}</span>
                      </a>
                    </Link>
                    <div className="flex pt1">
                      {news.votes.liked > 0 && (
                        <div className="flex pr2 green">
                          <ArrowUpward size={18} color="green" />
                          <span className="pl1">{news.votes.liked}</span>
                        </div>
                      )}
                      {news.votes.important > 0 && (
                        <div className="flex pr2 yellow">
                          <ReportProblem size={18} color="#daff00" />
                          <span className="pl1">{news.votes.important}</span>
                        </div>
                      )}
                      {news.votes.disliked > 0 && (
                        <div className="flex pr2 orange">
                          <ArrowDownward size={18} color="#ffa500" />
                          <span className="pl1">{news.votes.disliked}</span>
                        </div>
                      )}
                      {news.votes.positive > 0 && (
                        <div className="flex pr2 blue">
                          <ThumbUp size={18} color="#23a8c3" />
                          <span className="pl1">{news.votes.positive}</span>
                        </div>
                      )}
                      {news.votes.negative > 0 && (
                        <div className="flex pr2 red">
                          <ThumbDown size={18} color="#b70519" />
                          <span className="pl1">{news.votes.negative}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            {financeTab === "goals" && (
              <div className="flex light-gray" style={{ height: "100%" }}>
                <div className="goal-section-left flex flex-column col-6">
                  <h4 className="p1 m0 white center">DAILY GOALS</h4>
                  <label className="p1">
                    <input
                      className="strikethrough mr1"
                      type="checkbox"
                      name="wake"
                    />
                    <span>Wake up at 6AM</span>
                  </label>
                  <label className="p1">
                    <input
                      className="strikethrough mr1"
                      type="checkbox"
                      name="meditate"
                    />
                    <span>QT/Meditate</span>
                  </label>
                  <label className="p1 light-gray">
                    <input
                      className="strikethrough mr1"
                      type="checkbox"
                      name="jobs"
                    />
                    <span>Apply to jobs</span>
                  </label>
                  <label className="p1 light-gray">
                    <input
                      className="strikethrough mr1"
                      type="checkbox"
                      name="exercise"
                    />
                    <span>Exercise</span>
                  </label>
                  <label className="p1 light-gray">
                    <input
                      className="strikethrough mr1"
                      type="checkbox"
                      name="study"
                    />
                    <span>Study</span>
                  </label>
                  <label className="p1 light-gray">
                    <input
                      className="strikethrough mr1"
                      type="checkbox"
                      name="work"
                    />
                    <span>Work on Apps</span>
                  </label>
                  <label className="p1 light-gray">
                    <input
                      className="strikethrough mr1"
                      type="checkbox"
                      name="read"
                    />
                    <span>Read</span>
                  </label>
                </div>
                <div className="flex flex-column col-6">
                  <div className="todays-goal-section">
                    <h4 className="m0 p1 white center">GOALS FOR TODAY</h4>
                    {goalsToday.length < 1 ? (
                      <h4 className="m0 py1 center">(Nothing for today)</h4>
                    ) : (
                      <div className="flex flex-column">
                        {goalsToday.map((goal, idx) => {
                          return (
                            <div className="flex">
                              <label className="flex-auto p1 light-gray">
                                <input
                                  className="strikethrough mr1"
                                  type="checkbox"
                                  name="read"
                                />
                                <span>{goal.name}</span>
                              </label>
                              <Delete
                                className="icon pt1 mr1 pointer hover"
                                size={18}
                                color="lightgray"
                                onClick={() => {
                                  this.handleDelete("today", goal._id);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {todayModalOpen ? (
                      <div className="center">
                        <input
                          className="bg-dark-gray border-divider rounded white px1 my1 h6"
                          type="text"
                          name="newGoal"
                          onChange={this.handleChange}
                          autoComplete="off"
                        />
                        <div className="pt1">
                          <button
                            className="mx1 mb1 white pointer bg-dark-gray py1 rounded hover"
                            onClick={() => this.toggleGoalModal("today")}
                          >
                            Cancel
                          </button>
                          <button
                            className="mx1 white pointer bg-blue border-none py1 rounded hover"
                            onClick={() => this.handleSubmit("today")}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="center mb2">
                        <ControlPoint
                          className="pt1 pointer hover"
                          size={18}
                          color="lightgray"
                          onClick={() => this.toggleGoalModal("today")}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <div>
                      <h4 className="m0 p1 white center">GOALS FOR TOMORROW</h4>
                      {goalsTomorrow.length !== 0 ? (
                        <ol className="py1 pl3 m0">
                          {goalsTomorrow.map((goal, idx) => {
                            return (
                              <div className="flex">
                                <li className="flex-auto p1">{goal.name}</li>
                                <Delete
                                  className="icon pt1 mr1 pointer hover"
                                  size={18}
                                  color="lightgray"
                                  onClick={() => {
                                    this.handleDelete("tomorrow", goal._id);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </ol>
                      ) : (
                        <h4 className="m0 py1 center">
                          (Nothing for tomorrow)
                        </h4>
                      )}
                    </div>
                    {tomorrowModalOpen ? (
                      <div className="center">
                        <input
                          className="bg-dark-gray border-divider rounded white px1 my1 h6"
                          type="text"
                          name="newGoal"
                          onChange={this.handleChange}
                          autoComplete="off"
                        />
                        <div className="pt1">
                          <button
                            className="mx1 mb1 white pointer bg-dark-gray py1 rounded hover"
                            onClick={() => this.toggleGoalModal("tomorrow")}
                          >
                            Cancel
                          </button>
                          <button
                            className="mx1 white pointer bg-blue border-none py1 rounded hover"
                            onClick={() => this.handleSubmit("tomorrow")}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="center">
                        <ControlPoint
                          className="pt1 pointer hover"
                          size={18}
                          color="lightgray"
                          onClick={() => this.toggleGoalModal("tomorrow")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Stocks;
