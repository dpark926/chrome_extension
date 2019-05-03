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
    this.state = {
      financeTab: "goals",
      goalsDaily: [],
      goalsToday: [],
      goalsTomorrow: []
    };
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

    axios
      .get(keys.db + "/tasks")
      .then(res => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const goalsToday = res.data.filter(task => {
          return (
            new Date(task.goalDate).toString().slice(0, 15) ===
              today.toString().slice(0, 15) && task.isDailyGoal !== true
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

    axios.get(keys.db + "/dailyGoals").then(res => {
      this.setState({ goalsDaily: res.data });
    });
  }

  selectFinanceTab = category => {
    this.setState({ financeTab: category });
  };

  toggleGoalModal = type => {
    const { dailyModalOpen, todayModalOpen, tomorrowModalOpen } = this.state;

    switch (type) {
      case "daily":
        this.setState({ dailyModalOpen: !dailyModalOpen });
        break;
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
  };

  handleSubmit = type => {
    const { goalsDaily, goalsToday, goalsTomorrow, newGoal } = this.state;
    let clone = [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    switch (type) {
      case "daily":
        axios
          .post(keys.db + "/dailyGoals", {
            name: newGoal
          })
          .then(res =>
            this.setState({ goalsDaily: [...goalsDaily, res.data] })
          );
        break;
      case "today":
        axios
          .post(keys.db + "/tasks", {
            name: newGoal,
            goalDate: today.toString().slice(0, 15)
          })
          .then(res =>
            this.setState({ goalsToday: [...goalsToday, res.data] })
          );
        break;
      case "tomorrow":
        axios
          .post(keys.db + "/tasks", {
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
    const { goalsDaily, goalsToday, goalsTomorrow } = this.state;

    let clone = [];
    let newClone = [];

    switch (type) {
      case "daily":
        clone = goalsDaily.slice();
        newClone = clone.filter(goal => {
          return goal._id !== id;
        });
        axios
          .delete(`${keys.db}/dailyGoals/${id}`)
          .then(res => this.setState({ goalsDaily: newClone }));
        break;
      case "today":
        clone = goalsToday.slice();
        newClone = clone.filter(goal => {
          return goal._id !== id;
        });
        axios
          .delete(`${keys.db}/tasks/${id}`)
          .then(res => this.setState({ goalsToday: newClone }));
        break;
      case "tomorrow":
        clone = goalsTomorrow.slice();
        newClone = clone.filter(goal => {
          return goal._id !== id;
        });
        axios
          .delete(`${keys.db}/tasks/${id}`)
          .then(res => this.setState({ goalsTomorrow: newClone }));
        break;
      default:
        return;
    }
  };

  completedTask = (type, id) => {
    const { goalsToday, goalsTomorrow } = this.state;

    let clone = [];

    switch (type) {
      case "today":
        clone = goalsToday.slice();
        clone.forEach(goalObj => {
          if (goalObj._id === id) {
            goalObj.isComplete = !goalObj.isComplete;
          }
        });
        this.setState({ goalsToday: clone });
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
      dailyModalOpen,
      goalsDaily,
      goalsToday,
      goalsTomorrow
    } = this.state;

    let numOfGoalsTodayCompleted = 0;
    let numOfGoalsTomorrowCompleted = 0;

    goalsToday.forEach((goal, idx) => {
      if (goal.isComplete === true) {
        numOfGoalsTodayCompleted += 1;
      }
    });

    goalsTomorrow.forEach((goal, idx) => {
      if (goal.isComplete === true) {
        numOfGoalsTomorrowCompleted += 1;
      }
    });

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
        {!cryptoNewsData &&
          financeTab === "crypto" && (
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
            {financeTab === "stocks" && (
              <div className="center light-gray py4">(Coming Soon)</div>
            )}
            {financeTab === "goals" && (
              <div className="flex light-gray" style={{ height: "100%" }}>
                <div className="goal-section-left flex flex-column col-6">
                  <h4 className="p1 m0 white center">DAILY GOALS</h4>
                  {goalsDaily.map((goal, idx) => {
                    return (
                      <div className="flex">
                        <label className="flex-auto p1" key={goal + idx}>
                          <input
                            className="strikethrough mr1"
                            type="checkbox"
                            name="wake"
                          />
                          <span>{goal.name}</span>
                        </label>
                        <Delete
                          className="icon pt1 mr1 pointer hover"
                          size={18}
                          color="lightgray"
                          onClick={() => {
                            this.handleDelete("daily", goal._id);
                          }}
                        />
                      </div>
                    );
                  })}
                  {dailyModalOpen ? (
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
                          onClick={() => this.toggleGoalModal("daily")}
                        >
                          Cancel
                        </button>
                        <button
                          className="mx1 white pointer bg-blue border-none py1 rounded hover"
                          onClick={() => this.handleSubmit("daily")}
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
                        onClick={() => this.toggleGoalModal("daily")}
                      />
                    </div>
                  )}
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
                            <div>
                              <div className="flex">
                                <label className="flex-auto p1 light-gray">
                                  <input
                                    className="strikethrough mr1"
                                    type="checkbox"
                                    name="read"
                                    onChange={() =>
                                      this.completedTask("today", goal._id)
                                    }
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
                            </div>
                          );
                        })}
                        <p className="center">{`${numOfGoalsTodayCompleted} / ${
                          goalsToday.length
                        } COMPLETED`}</p>
                        <div className="flex mb1 mx2">
                          <div
                            className={`border ${
                              numOfGoalsTodayCompleted === goalsToday.length
                                ? "green"
                                : "yellow"
                            }`}
                            style={{
                              width:
                                (numOfGoalsTodayCompleted / goalsToday.length) *
                                  100 +
                                "%"
                            }}
                          />
                          <div
                            className="border light-gray"
                            style={{
                              width:
                                100 -
                                (numOfGoalsTodayCompleted / goalsToday.length) *
                                  100 +
                                "%"
                            }}
                          />
                        </div>
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
                              <div>
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
