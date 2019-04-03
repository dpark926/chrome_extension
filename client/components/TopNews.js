import React, { Component, Fragment } from "react";
import Link from "next/link";
import Loader from "react-loader";
import { keys } from "../config/keys";
import "../styles/topnews.scss";

class TopNews extends Component {
  constructor() {
    super();
    this.state = {
      categoryTab: "general"
    };
  }

  componentDidMount() {
    fetch(
      `https://${keys.newsAPI}top-headlines?country=us&apiKey=${
        keys.newsAPIKey
      }`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          newsData: data
        })
      )
      .catch(err => console.log(err));
  }

  selectCategoryTab = category => {
    this.setState({ categoryTab: category });

    fetch(
      `https://${
        keys.newsAPI
      }top-headlines?country=us&category=${category}&apiKey=${keys.newsAPIKey}`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          newsData: data
        })
      )
      .catch(err => console.log(err));
  };

  render() {
    const { newsData, categoryTab } = this.state;

    return (
      <div className="news-section col-6 relative">
        <div className="category-tab flex">
          <div
            className={`category-tab-item col-4 center pointer p1 ${
              categoryTab === "general" ? "bg-dark-gray" : "bg-black light-gray"
            }`}
            onClick={() => this.selectCategoryTab("general")}
          >
            Top News
          </div>
          <div
            className={`category-tab-item col-4 center pointer p1 ${
              categoryTab === "business"
                ? "bg-dark-gray"
                : "bg-black light-gray"
            }`}
            onClick={() => this.selectCategoryTab("business")}
          >
            Business
          </div>
          <div
            className={`category-tab-item col-4 center pointer p1 ${
              categoryTab === "sports" ? "bg-dark-gray" : "bg-black light-gray"
            }`}
            onClick={() => this.selectCategoryTab("sports")}
          >
            Sports
          </div>
          <div
            className={`category-tab-item col-4 center pointer p1 ${
              categoryTab === "technology"
                ? "bg-dark-gray"
                : "bg-black light-gray"
            }`}
            onClick={() => this.selectCategoryTab("technology")}
          >
            Tech
          </div>
        </div>
        {!newsData && (
          <div className="relative p4">
            <Loader color="#fff" />
          </div>
        )}
        <div
          className="absolute"
          style={{
            height: "calc(100vh - 260px)",
            borderRight: "1px solid #9d9d9f",
            right: "-1px"
          }}
        >
          <div className="overflow-scroll" style={{ height: "100%" }}>
            {newsData &&
              categoryTab === "general" &&
              newsData.articles.map((news, idx) => {
                return (
                  <div key={idx} className="news-item p1">
                    <Link href={news.url}>
                      <a target="_blank">{news.title}</a>
                    </Link>
                  </div>
                );
              })}
            {newsData &&
              categoryTab === "business" &&
              newsData.articles.map((news, idx) => {
                return (
                  <div key={idx} className="news-item p1">
                    <Link href={news.url}>
                      <a target="_blank">{news.title}</a>
                    </Link>
                  </div>
                );
              })}
            {newsData &&
              categoryTab === "sports" &&
              newsData.articles.map((news, idx) => {
                return (
                  <div key={idx} className="news-item p1">
                    <Link href={news.url}>
                      <a target="_blank">{news.title}</a>
                    </Link>
                  </div>
                );
              })}
            {newsData &&
              categoryTab === "technology" &&
              newsData.articles.map((news, idx) => {
                return (
                  <div key={idx} className="news-item p1">
                    <Link href={news.url}>
                      <a target="_blank">{news.title}</a>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default TopNews;
