import React, { Component, Fragment } from "react";
import Link from "next/link";
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

    console.log(forecastData);

    for (let key in fiveDayForecast) {
      newArr.push(fiveDayForecast[key]);
    }

    return (
      <div className="weather flex">
        {weatherData && (
          <div className="center p1 flex flex-column justify-center col-2">
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
