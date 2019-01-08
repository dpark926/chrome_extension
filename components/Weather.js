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
      `https://${keys.openWeatherMapAPI}?appid=${
        keys.openWeatherMapAPIKey
      }&zip=${currentZip},us`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          weatherData: data
        })
      )
      .catch(err => console.log(err));
  };

  render() {
    const { weatherData } = this.state;

    console.log(weatherData);

    return (
      <div>
        <h1>Weather</h1>
        {weatherData && (
          <div>
            <div>Temp: {weatherData.main.temp}</div>
            <div>Temp Max: {weatherData.main.temp_max}</div>
            <div>Temp Min: {weatherData.main.temp_min}</div>
            <div>Humidity: {weatherData.main.humidity}</div>
            <div>Pressure: {weatherData.main.pressure}</div>
            <div>{weatherData.weather[0].description}</div>
          </div>
        )}
      </div>
    );
  }
}

export default Weather;
