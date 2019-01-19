import React, { Component, Fragment } from "react";
import Link from "next/link";
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
    const { currentZip } = this.state;

    fetch(
      `https://${keys.openWeatherMapAPI}weather?appid=${
        keys.openWeatherMapAPIKey
      }&units=imperial&zip=${currentZip},us`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          weatherData: data
        })
      )
      .catch(err => console.log(err));

    fetch(
      `https://${keys.openWeatherMapAPI}forecast?appid=${
        keys.openWeatherMapAPIKey
      }&units=imperial&zip=${currentZip},us`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          forecastData: data
        })
      )
      .catch(err => console.log(err));
  }

  render() {
    const { weatherData, forecastData } = this.state;
    const fiveDayForecast = {};
    let newArr = [];

    if (forecastData) {
      for (let i = 0; i < forecastData.list.length; i++) {
        let forecast = forecastData.list[i];
        let date = forecast.dt_txt.slice(0, 10);

        if (fiveDayForecast[date]) {
          if (fiveDayForecast[date].high > forecast.main.temp) {
            fiveDayForecast[date].low = forecast.main.temp;
          } else if (fiveDayForecast[date].high < forecast.main.temp) {
            fiveDayForecast[date].high = forecast.main.temp;
          }
        } else {
          fiveDayForecast[date] = {
            ["dt"]: date,
            ["high"]: forecast.main.temp,
            ["low"]: 0,
            ["description"]: forecast.weather[0].description
          };
        }
      }
    }

    for (let key in fiveDayForecast) {
      newArr.push(fiveDayForecast[key]);
    }

    return (
      <div className="topnews weather flex">
        {weatherData && (
          <div className="center m1 flex flex-column justify-center">
            <div>{weatherData.name}</div>
            <div className="capitalize">
              {weatherData.weather[0].description}
            </div>
            <div className="h2">{Math.round(weatherData.main.temp)}°</div>
            <p className="flex justify-center m0">
              <span className="p1">
                {Math.round(weatherData.main.temp_max)}°
              </span>
              <span className="p1">
                {Math.round(weatherData.main.temp_min)}°
              </span>
            </p>
            <div>Humidity: {weatherData.main.humidity}</div>
            <div>Pressure: {weatherData.main.pressure}</div>
          </div>
        )}
        <div className="flex flex-auto">
          {forecastData &&
            newArr &&
            newArr.map((forecast, idx) => {
              return (
                <div key={idx} className="weather-item center">
                  <h4>{forecast.dt}</h4>
                  <p className="capitalize">{forecast.description}</p>
                  <p>
                    <span className="p1">{Math.round(forecast.high)}°</span>
                    <span className="p1">{Math.round(forecast.low)}°</span>
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
