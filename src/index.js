const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 8080;
const WEGMANS_API_KEY = '0b56c8208dc64b7b9eb0f218036fcf00';

app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

app.use(express.static('public'));


app.get('/getRecipe/:filter', async (request, response) => {


  if(request.params.filter !== "noFilter") {
    const food_url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${request.params.filter}`;
    const food_response = await fetch(food_url);
    //randomize returned meal (3 total for vegan, 31 total for vegetarian)
    var randoItem = 0;
    if(request.params.filter === "vegetarian") {
      randoItem = randomNumber(0, 30);
    } else {
      randoItem = randomNumber(0, 2);
    }
    const food_data = await food_response.json();

    response.json(food_data.meals[randoItem]);
  } else {
    const food_url = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const food_response = await fetch(food_url);
    const food_data = await food_response.json();
    response.json(food_data);
  }
});

app.get('/findProduct/:ingredient', async (request, response) => {
  const product_url = `https://api.wegmans.io/products/search?query=${request.params.ingredient}&api-version=2018-10-18&Subscription-Key=${WEGMANS_API_KEY}`;
  const product_response = await fetch(product_url);
  const product_data = await product_response.json();

  const bestProduct_url = `https://api.wegmans.io${product_data.results[0]._links[0].href}&Subscription-Key=${WEGMANS_API_KEY}`;
  const bestProduct_response = await fetch(bestProduct_url);
  const bestProduct_data = await bestProduct_response.json();

  response.json(bestProduct_data);
});

app.get('/findPrice/:sku', async (request, response) => {
  const productPrice_url = `https://api.wegmans.io/products/${request.params.sku}/prices/1?api-version=2018-10-18&Subscription-Key=${WEGMANS_API_KEY}`;
  const productPrice_response = await fetch(productPrice_url);
  const productPrice_data = await productPrice_response.json();

  response.json(productPrice_data);
});

function randomNumber(minimum, maximum){
  return Math.round( Math.random() * (maximum - minimum) + minimum);
}


