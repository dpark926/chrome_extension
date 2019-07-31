import React, { useState, useEffect } from "react";
import Link from "next/link";
import Settings from "rmdi/lib/Settings";
import { Days } from "../src/date";
import { weatherIcons } from "../src/weatherIcons";
import { keys } from "../config/keys";
import axios from "axios";
import "../styles/styles.scss";
import "../styles/weather.scss";

const Weather = () => {
  const [currentZip, setCurrentZip] = useState("11101");
  const [zipData, setZipData] = useState();
  const [zipCode, setZipCode] = useState();
  const [weatherModalOpen, setWeatherModalOpen] = useState();
  const [weatherData, setWeatherData] = useState();
  const [forecastData, setForecastData] = useState();

  useEffect(() => {
    axios
      .get("/api/weathers")
      .then(res => {
        setCurrentZip(res.data[0].zipcode);
        setZipData(res.data);
        fetchWeatherData(res.data[0].zipcode);
      })
      .catch(fetchWeatherData());
  }, []);

  const toggleWeatherModal = () => {
    setWeatherModalOpen(!weatherModalOpen);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (zipData) {
      axios
        .post(`api/weathers/${zipData[0]._id}`, {
          zipcode: zipCode
        })
        .then(res => {
          setCurrentZip(res.data.zipcode);
          setZipData([res.data]);
          fetchWeatherData(res.data.zipcode);
        });
    } else {
      axios
        .post("/api/weathers", {
          zipcode: zipCode
        })
        .then(res => {
          setCurrentZip(res.data.zipcode);
          fetchWeatherData(currentZip);
        });
    }

    toggleWeatherModal();
  };

  const fetchWeatherData = (zipCode = currentZip) => {
    fetch(
      `${keys.openWeatherMapAPI}weather?appid=${
        keys.openWeatherMapAPIKey
      }&units=imperial&zip=${zipCode},us`
    )
      .then(response => response.json())
      .then(data => setWeatherData(data))
      .catch(err => console.log(err));

    fetch(
      `${keys.openWeatherMapAPI}forecast?appid=${
        keys.openWeatherMapAPIKey
      }&units=imperial&zip=${zipCode},us`
    )
      .then(response => response.json())
      .then(data => setForecastData(data))
      .catch(err => console.log(err));
  };

  const fiveDayForecast = {};
  let newArr = [];

  if (forecastData && currentZip) {
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

  console.log(weatherData, forecastData);

  return (
    <div className="weather flex">
      {weatherModalOpen && (
        <div className="relative center p1 col-2">
          <Settings
            className="absolute p1 pointer hover"
            size={18}
            color="lightgray"
            onClick={toggleWeatherModal}
            style={{ top: 0, right: 0 }}
          />
          <form
            className="flex flex-column justify-center py3"
            onSubmit={handleSubmit}
          >
            <input
              className="bg-dark-gray border-divider center rounded white py1 mx2 h6"
              type="text"
              name="zipCode"
              placeholder="Enter Zip Code"
              onChange={e => setZipCode(e.target.value)}
            />
            <input
              type="submit"
              className="white pointer bg-blue border-none py1 my1 mx2 h6 rounded hover"
            />
          </form>
        </div>
      )}
      {weatherData && currentZip && !weatherModalOpen ? (
        <div className="weather-current center p1 col-2">
          <Settings
            className="absolute p1 pointer hover"
            size={18}
            color="lightgray"
            onClick={toggleWeatherModal}
            style={{ top: 0, right: 0 }}
          />
          <div>{weatherData.name}</div>
          <div className="weather-description capitalize light-gray">
            {weatherData.weather[0].description}
          </div>
          <div>
            <img
              src={weatherIcons[weatherData.weather[0].icon]}
              className="weather-icon"
            />
          </div>
          <div className="h2">{Math.round(weatherData.main.temp)}°</div>
          <p className="flex justify-center m0 light-gray">
            <span className="p1">{Math.round(weatherData.main.temp_max)}°</span>
            <span className="p1">{Math.round(weatherData.main.temp_min)}°</span>
          </p>
        </div>
      ) : (
        <div className="weather-current p1 items-center col-2">
          <div className="weather-text--placeholder bg-dark-gray m1 col-9" />
          <div className="weather-icon bg-dark-gray m1" />
          <div className="weather-text--placeholder bg-dark-gray m1 col-6" />
        </div>
      )}
      <div className="weather-forcast flex flex-auto justify-center">
        {forecastData && newArr
          ? newArr.map((forecast, idx) => {
              var d = new Date(forecast.dt);

              return (
                <div
                  key={idx}
                  className="flex flex-column justify-center weather-item col-2 center p1"
                >
                  <h4 className="m0">{Days[d.getDay()].abv.toUpperCase()}</h4>
                  <p className="weather-description capitalize light-gray m0">
                    {forecast.description}
                  </p>
                  <div className="py1">
                    <img
                      src={weatherIcons[forecast.icon]}
                      className="weather-icon"
                    />
                  </div>
                  <p className="m0">
                    <span className="weather-temp--high">
                      {Math.round(forecast.high)}°
                    </span>
                    <span className="weather-temp--low light-gray">
                      {Math.round(forecast.low)}°
                    </span>
                  </p>
                </div>
              );
            })
          : [1, 2, 3, 4, 5].map((el, idx) => {
              return (
                <div className="relative p1 flex flex-column items-center weather-item col-2">
                  <div className="weather-text--placeholder bg-dark-gray m1 col-9" />
                  <div className="weather-icon bg-dark-gray m1" />
                  <div className="weather-text--placeholder bg-dark-gray m1 col-6" />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Weather;
