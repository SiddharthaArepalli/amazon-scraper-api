const express = require('express');
const request = require('request-promise');
const app = express();
const PORT = process.env.PORT || 5000;
// const baseUrl = `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;
const generateScrapperUrl = (apiKey) => `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('welcome to the amazon Scraper API');
});
// get product details
app.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const { apiKey } = req.query;
    try{
        const response = await request(`${generateScrapperUrl(apiKey)}&url=https://www.amazon.com/dp/${productId}`);
        res.json(JSON.parse(response));
    }
    catch(error){
        res.json(error);
    }
});
app.get('/products/:productId/reviews', async (req, res) => {
    const { productId } = req.params;
    const { apiKey } = req.query;
    try {
        const response = await request(`${generateScrapperUrl(apiKey)}&url=https://www.amazon.com/dp/${productId}`);
        const productData = JSON.parse(response);
        const reviews = productData.reviews || [];
        res.json(reviews);
    } catch (error) {
        res.json(error);
    }
});
   
// get product images
app.get('/products/:productId/images', async (req, res) => {
    const { productId } = req.params;
    const { apiKey } = req.query;
    try {
        const response = await request(`${generateScrapperUrl(apiKey)}&url=https://www.amazon.com/dp/${productId}`);
        const productData = JSON.parse(response);
        const images = productData.images || [];
        res.json(images);
    } catch (error) {
        res.json(error);
    }
});
// get search results
app.get('/search/:searchTerm', async (req, res) => {
    const { searchTerm } = req.params;
    const { apiKey } = req.query;
    try {
        const response = await request(`${generateScrapperUrl(apiKey)}&url=https://www.amazon.com/s?k=${searchTerm}`);
        res.json(JSON.parse(response));
    } catch (error) {
        res.json(error);
    }
}  
);
app.listen(PORT, () => {    
  console.log(`Server is running on PORT ${PORT}`);
});