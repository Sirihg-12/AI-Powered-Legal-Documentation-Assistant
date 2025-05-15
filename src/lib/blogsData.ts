// src/lib/blogsData.ts
import { v4 as uuidv4 } from 'uuid';

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  author: string;
  imageUrl: string;
  tags: string[];
}

export const getAIBlogs = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(
        'https://newsapi.org/v2/everything?q=law%20OR%20legal%20OR%20policy%20OR%20court%20OR%20regulation&language=en&sortBy=publishedAt&pageSize=5&apiKey=21df84152bc4482bb7878527c74a96fe'
      );
      
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      console.warn("No articles found");
      return [];
    }

    const summarizedBlogs: BlogPost[] = await Promise.all(
      data.articles.map(async (article: any) => {
        const aiSummaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer `,  // Make sure to put your OpenAI API key here
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You summarize legal articles in simple, concise form.' },
              { role: 'user', content: `Summarize this legal news article:\n${article.title}\n\n${article.description}` }
            ]
          }),
        });

        const aiSummary = await aiSummaryResponse.json();

        return {
          id: uuidv4(),
          title: article.title,
          summary: aiSummary.choices[0].message.content.trim(),
          url: article.url,
          date: new Date(article.publishedAt).toLocaleDateString(),
          author: article.author || "Unknown",
          imageUrl: article.urlToImage || "https://via.placeholder.com/600x400",
          tags: ['AI', 'Law', 'News'],
        };
      })
    );

    return summarizedBlogs;
  } catch (error) {
    console.error("Error fetching or summarizing blogs:", error);
    return [];
  }
};
