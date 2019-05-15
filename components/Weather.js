import dotenv from "dotenv";
dotenv.config();
import React, { Component, Fragment } from "react";
import Link from "next/link";
import Settings from "rmdi/lib/Settings";
import { Days } from "../src/date";
import { weatherIcons } from "../src/weatherIcons";
import { keys } from "../config/keys";
import "../styles/styles.scss";
import "../styles/weather.scss";

class Weather extends Component {
  constructor() {
    super();
    this.state = {
      currentZip: "11101"
    };
  }

  componentDidMount() {
    this.fetchWeatherData();
  }

  toggleWeatherModal = () => {
    const { weatherModalOpen } = this.state;
    this.setState({ weatherModalOpen: !weatherModalOpen });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.fetchWeatherData(this.state.zipCode);
    this.toggleWeatherModal();
  };

  fetchWeatherData = (zipCode = this.state.currentZip) => {
    fetch(
      `${process.env.openWeatherMapAPI}weather?appid=${
        process.env.openWeatherMapAPIKey
      }&units=imperial&zip=${zipCode},us`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          weatherData: data
        })
      )
      .catch(err => console.log(err));

    fetch(
      `${process.env.openWeatherMapAPI}forecast?appid=${
        process.env.openWeatherMapAPIKey
      }&units=imperial&zip=${zipCode},us`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          forecastData: data
        })
      )
      .catch(err => console.log(err));
  };

  render() {
    const { weatherData, forecastData, weatherModalOpen } = this.state;
    const fiveDayForecast = {};
    let newArr = [];

    if (forecastData) {
      for (let i = 0; i < forecastData.list.length; i++) {
        let forecast = forecastData.list[i];
        let date = forecast.dt_txt.slice(0, 10);
        let time = forecast.dt_txt.slice(11, 13);

        if (fiveDayForecast[date]) {
          if (fiveDayForecast[date].high > forecast.main.temp) {
            fiveDayForecast[date].low = forecast.main.temp;
          } else if (fiveDayForecast[date].high < forecast.main.temp) {
            fiveDayForecast[date].high = forecast.main.temp;
          }
          if (time === "15") {
            fiveDayForecast[date].description = forecast.weather[0].description;
            fiveDayForecast[date].icon = forecast.weather[0].icon;
          }
        } else {
          fiveDayForecast[date] = {
            ["dt"]: forecast.dt_txt,
            ["high"]: forecast.main.temp,
            ["low"]: 0,
            ["description"]: forecast.weather[0].description,
            ["icon"]: forecast.weather[0].icon
          };
        }
      }
    }

    for (let key in fiveDayForecast) {
      newArr.push(fiveDayForecast[key]);
    }

    return (
      <div className="weather flex">
        {weatherModalOpen && (
          <div className="relative center p1 col-2">
            <Settings
              className="absolute p1 pointer hover"
              size={18}
              color="lightgray"
              onClick={this.toggleWeatherModal}
              style={{ top: 0, right: 0 }}
            />
            <form
              className="flex flex-column justify-center py3"
              onSubmit={this.handleSubmit}
            >
              <input
                className="bg-dark-gray border-divider center rounded white py1 mx2 h6"
                type="text"
                name="zipCode"
                placeholder="Enter Zip Code"
                onChange={this.handleChange}
              />
              <input
                type="submit"
                className="white pointer bg-blue border-none py1 my1 mx2 h6 rounded hover"
              />
            </form>
          </div>
        )}
        {weatherData &&
          !weatherModalOpen && (
            <div className="relative center p1 flex flex-column justify-center col-2">
              <Settings
                className="absolute p1 pointer hover"
                size={18}
                color="lightgray"
                onClick={this.toggleWeatherModal}
                style={{ top: 0, right: 0 }}
              />
              <div>{weatherData.name}</div>
              <div className="capitalize light-gray">
                {weatherData.weather[0].description}
              </div>
              <div>
                <img
                  src={weatherIcons[weatherData.weather[0].icon]}
                  width={52}
                  height={52}
                />
              </div>
              <div className="h2">{Math.round(weatherData.main.temp)}°</div>
              <p className="flex justify-center m0 light-gray">
                <span className="p1">
                  {Math.round(weatherData.main.temp_max)}°
                </span>
                <span className="p1">
                  {Math.round(weatherData.main.temp_min)}°
                </span>
              </p>
            </div>
          )}
        <div className="flex flex-auto justify-center col-10">
          {forecastData &&
            newArr &&
            newArr.map((forecast, idx) => {
              var d = new Date(forecast.dt);

              return (
                <div
                  key={idx}
                  className="flex flex-column justify-center weather-item col-2 center p1"
                >
                  <h4 className="m0">{Days[d.getDay()].abv.toUpperCase()}</h4>
                  <p className="capitalize light-gray m0">
                    {forecast.description}
                  </p>
                  <div className="py1">
                    <img
                      src={weatherIcons[forecast.icon]}
                      width={52}
                      height={52}
                    />
                  </div>
                  <p className="m0">
                    <span className="p1">{Math.round(forecast.high)}°</span>
                    <span className="p1 light-gray">
                      {Math.round(forecast.low)}°
                    </span>
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Weather;
