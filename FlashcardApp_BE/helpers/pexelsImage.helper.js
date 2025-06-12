const axios = require("axios");

async function searchPexelsImage(query, perPage = 1) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error("Pexels API is not found");
  }

  try {
    const response = await axios.get("https://api.pexels.com/v1/search", {
      headers: {
        Authorization: apiKey,
      },
      params: {
        query,
        per_page: perPage,
      },
    });


    return response.data.photos.map(photo => ({
      id: photo.id,
      photographer: photo.photographer,
      url: photo.url,
      src: photo.src.medium, // hoặc photo.src.original tùy mục đích
    }));

  } catch (error) {
    console.error("Error with Pexels API:", error.message);
    return [];
  }
}

module.exports = searchPexelsImage;