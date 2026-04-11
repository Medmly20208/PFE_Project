import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";
import { FireIcon } from "@heroicons/react/24/outline";

const TrendingNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        ` https://api.marketaux.com/v1/news/all?exchanges=NYSE&filter_entities=true&api_token=${import.meta.env.VITE_API_NEWS_TOKEN}`,
      )
      .then((res) => {
        console.log("news", res);
        setNews(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="bg-white h-full  border rounded-2xl ">
      <div className="flex items-center gap-2 p-4">
        <FireIcon className="w-12" />
        <p className="text-2xl font-bold">Trending News</p>
      </div>
      {news?.map((item) => {
        console.log("mine", item);
        return (
          <NewsCard
            key={item.uuid}
            title={item.title}
            description={item.description}
            link={item.url}
          />
        );
      })}
    </div>
  );
};

export default TrendingNews;
