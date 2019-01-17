import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";

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
      <div>
        <h1>Weather</h1>
        {weatherData && (
          <div>
            <div>{weatherData.name}</div>
            <div>Temp: {weatherData.main.temp}</div>
            <div>Temp Max: {weatherData.main.temp_max}</div>
            <div>Temp Min: {weatherData.main.temp_min}</div>
            <div>Humidity: {weatherData.main.humidity}</div>
            <div>Pressure: {weatherData.main.pressure}</div>
            <div>{weatherData.weather[0].description}</div>
          </div>
        )}
        <div className="flex">
          {forecastData &&
            newArr &&
            newArr.map((forecast, idx) => {
              return (
                <div
                  key={idx}
                  className="flex-auto center m1"
                  style={{ border: "1px solid red" }}
                >
                  <h4>{forecast.dt}</h4>
                  <p>{forecast.description}</p>
                  <p>High: {forecast.high}</p>
                  <p>Low: {forecast.low}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Weather;
