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

  componentDidMount = () => {
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
  };

  render() {
    const { weatherData, forecastData } = this.state;

    console.log(weatherData);
    console.log(forecastData);

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
        <div>
          {forecastData &&
            forecastData.list.map((forecast, idx) => {
              return (
                <div>
                  <h4>{forecast.dt_txt}</h4>
                  <p>Temp: {forecast.main.temp}</p>
                  <p>{forecast.weather[0].description}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Weather;
