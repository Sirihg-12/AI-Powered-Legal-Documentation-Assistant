import axios from 'axios';

const NEWS_API_KEY = 'YOUR_NEWS_API_KEY'; // You can get one from https://newsapi.org
const NEWS_URL = `https://newsapi.org/v2/top-headlines?q=legal&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`;

export const fetchLegalNews = async () => {
  const response = await axios.get(NEWS_URL);
  return response.data.articles;
};
