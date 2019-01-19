import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";
import "../styles/topnews.scss";

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
      <div className="col-6">
        {newsData &&
          newsData.articles.map((news, idx) => {
            return (
              <div key={idx} className="news-section p1">
                <Link href={news.url}>
                  <a>{news.title}</a>
                </Link>
              </div>
            );
          })}
      </div>
    );
  }
}

export default TopNews;
