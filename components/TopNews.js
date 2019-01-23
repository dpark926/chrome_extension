import React, { Component, Fragment } from "react";
import Link from "next/link";
import Loader from "react-loader";
import { keys } from "../config/keys";
import "../styles/topnews.scss";

class TopNews extends Component {
  constructor() {
    super();
    this.state = {
      categoryTab: "topnews"
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
  };

  render() {
    const { newsData, categoryTab } = this.state;

    return (
      <div className="news-section col-6">
        <div className="category-tab flex">
          <div
            className={`category-tab-item col-4 center pointer p1 ${
              categoryTab === "topnews" ? "bg-dark-gray" : "bg-black light-gray"
            }`}
            onClick={() => this.selectCategoryTab("topnews")}
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
              categoryTab === "tech" ? "bg-dark-gray" : "bg-black light-gray"
            }`}
            onClick={() => this.selectCategoryTab("tech")}
          >
            Tech
          </div>
        </div>
        {!newsData && (
          <div className="relative p4">
            <Loader color="#fff" />
          </div>
        )}
        {newsData &&
          categoryTab === "topnews" &&
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
    );
  }
}

export default TopNews;
