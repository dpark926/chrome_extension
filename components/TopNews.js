import React, { Component, Fragment } from "react";
import Link from "next/link";
import { keys } from "../config/keys";

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
      <div>
        <h1>TopNews</h1>
        {newsData &&
          newsData.articles.map((news, idx) => {
            return (
              <div key={idx}>
                <div>{news.title}</div>
                <div>{news.author}</div>
                <div>{news.source.name}</div>
              </div>
            );
          })}
      </div>
    );
  }
}

export default TopNews;
