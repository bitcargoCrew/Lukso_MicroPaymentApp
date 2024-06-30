import * as cheerio from "cheerio";

interface JobListing {
  title: string;
  description: string;
  link: string;
}

export const getLuksoJobs = async (): Promise<JobListing[]> => {
  try {
    const url = "https://lukso.network/careers";
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const jobListings: JobListing[] = [];

    const indices = [4, 8, 9, 13, 15];

    $("#__next > main > div:nth-child(2) > div").each((index, element) => {
      indices.forEach((i) => {
        const title = $(element)
          .find(`div:nth-child(${i}) > div > div:nth-child(1) > h3`)
          .text()
          .trim();
        const description = $(element)
          .find(
            `div:nth-child(${i}) > div > div.flex.h-full.flex-col.justify-end > div:nth-child(1) > p`
          )
          .text()
          .trim();
        const link = $(element)
          .find(
            `div:nth-child(${i}) > div > div.flex.h-full.flex-col.justify-end > div.mt-\\[1\\.25rem\\] > div > div > a`
          )
          .attr("href");
        if (title && description && link) {
          jobListings.push({
            title,
            description,
            link: `${link}`,
          });
        }
      });
    });

    return jobListings;
  } catch (error) {
    console.error("Error fetching job listings:", error);
    return [];
  }
};