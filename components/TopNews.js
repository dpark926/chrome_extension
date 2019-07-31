import React, { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "react-loader";
import { keys } from "../config/keys";
import "../styles/topnews.scss";

const TopNews = () => {
  const [categoryTab, setCategoryTab] = useState("general");
  const [newsData, setNewsData] = useState();
  const categories = ["general", "business", "sports", "technology"];

  useEffect(() => {
    fetch(
      `https://${keys.newsAPI}top-headlines?country=us&apiKey=${
        keys.newsAPIKey
      }`
    )
      .then(response => response.json())
      .then(data => setNewsData(data))
      .catch(err => console.log(err));
  }, []);

  const selectCategoryTab = category => {
    setCategoryTab(category);

    fetch(
      `https://${
        keys.newsAPI
      }top-headlines?country=us&category=${category}&apiKey=${keys.newsAPIKey}`
    )
      .then(response => response.json())
      .then(data => setNewsData(data))
      .catch(err => console.log(err));
  };

  return (
    <div className="news-section relative">
      <div className="category-tab flex">
        {categories.map((category, idx) => {
          return (
            <div
              className={`category-tab-item col-4 center pointer p1 capitalize ${
                categoryTab === category
                  ? "bg-dark-gray"
                  : "bg-black light-gray"
              }`}
              key={idx + category}
              onClick={() => selectCategoryTab(category)}
            >
              {category === "general" ? "Top News" : category}
            </div>
          );
        })}
      </div>
      {!newsData && (
        <div className="relative p4">
          <Loader color="#fff" />
        </div>
      )}
      <div className="news-body">
        <div className="overflow-scroll" style={{ height: "100%" }}>
          {categories.map(category => {
            return (
              newsData &&
              categoryTab === category &&
              newsData.articles.map((news, idx) => {
                return (
                  <div key={idx} className="news-item p1">
                    <Link href={news.url}>
                      <a target="_blank">{news.title}</a>
                    </Link>
                  </div>
                );
              })
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopNews;
