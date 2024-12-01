const request = require('request-promise');

// Function to generate scraper URL with API key
const generateScrapperUrl = (apiKey) => `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;

// Main handler for all routes
module.exports = async (req, res) => {
  const { productId, searchTerm } = req.query;  // Use query params in URL
  const { apiKey } = req.query;  // API key passed in query params

  if (!apiKey) {
    return res.status(400).json({ error: 'API Key is required' });
  }

  try {
    let url;
    let response;
    
    // Handling /products/:productId route
    if (productId && !req.url.includes('reviews') && !req.url.includes('images')) {
      url = `https://www.amazon.com/dp/${productId}`;
      response = await request(`${generateScrapperUrl(apiKey)}&url=${url}`);
      return res.status(200).json(JSON.parse(response));
    }

    // Handling /products/:productId/reviews route
    if (productId && req.url.includes('reviews')) {
      url = `https://www.amazon.com/dp/${productId}`;
      response = await request(`${generateScrapperUrl(apiKey)}&url=${url}`);
      const productData = JSON.parse(response);
      const reviews = productData.reviews || [];
      return res.status(200).json(reviews);
    }

    // Handling /products/:productId/images route
    if (productId && req.url.includes('images')) {
      url = `https://www.amazon.com/dp/${productId}`;
      response = await request(`${generateScrapperUrl(apiKey)}&url=${url}`);
      const productData = JSON.parse(response);
      const images = productData.images || [];
      return res.status(200).json(images);
    }

    // Handling /search/:searchTerm route
    if (searchTerm) {
      url = `https://www.amazon.com/s?k=${searchTerm}`;
      response = await request(`${generateScrapperUrl(apiKey)}&url=${url}`);
      return res.status(200).json(JSON.parse(response));
    }

    // If neither productId nor searchTerm is provided
    return res.status(400).json({ error: 'Product ID or search term is required' });

  } catch (error) {
    // If an error occurs, return the error as a JSON response
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
