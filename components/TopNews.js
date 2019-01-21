import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";
import "../styles/topnews.scss";
import Loader from "react-loader";

class TopNews extends Component {
  constructor() {
    super();
    this.state = {};
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

  render() {
    const { newsData } = this.state;

    return (
      <div className="news-section col-6">
        {!newsData && (
          <div className="relative p4">
            <Loader color="#fff" />
          </div>
        )}
        {newsData &&
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
