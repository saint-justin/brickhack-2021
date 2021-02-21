var mealPrice = 0;
//ingredient=>price
var ingredientList = [];
//unfortunately, the free API we chose for recipes only provides
// two categories of filtering (vegan/vegetarian)
var filter = "noFilter";

async function getRecipe() {
  try {
    mealPrice = 0;
    ingredientList = [];
    document.getElementById('priceList').innerHTML = "";
    filter = "noFilter";

    if(document.getElementById('vegetarian').checked) {
      console.log("Vegetarian Choice");
      filter = "vegetarian";
    }

    if(document.getElementById('vegan').checked) {
      console.log("Vegan Choice");
      filter = "vegan";
    }

    const response = await fetch(`getRecipe/${filter}`);
    const json = await response.json();

    console.log(json);

    var imageLink = await json.meals[0].strYoutube;
    document.getElementById('imageLink').href = imageLink;

    var mealName = await json.meals[0].strMeal;
    document.getElementById('mealName').innerHTML = mealName;

    var foodImage = await json.meals[0].strMealThumb;
    document.getElementById('mealImage').src = foodImage;

    var ingredients = "";
    var productArray = [];

    //get rid of empty ingredient values inside randomized meal
    $.each(json.meals[0], function(key,value){
      if(value==""||value==null){
        delete json.meals[0][key];
      } else if (key.substring(0,13)==="strIngredient"){
        ingredients += ("<li>"+json.meals[0][key]+"</li>");
        productArray.push(json.meals[0][key]);
      }
    });

    document.getElementById('ingredientList').innerHTML = ingredients;

    for(var i=0; i<productArray.length; i++){
      findProduct(productArray[i]);
    }

  } catch (error) {
    console.error(error);
  }
}

async function findProduct(ingredient) {
  try {
    const url = `findProduct/${ingredient}`;
    const response = await fetch(url);
    const json = await response.json();

    var bestProductInfo = await json;

    var currentPrice = await findPrice(bestProductInfo.sku);

    document.getElementById('priceList').innerHTML += "<li>$"+ currentPrice + ", "+ bestProductInfo.name + "</li>";

  } catch (error) {
    console.error(error);
  }
}

async function findPrice(sku) {
  try {
    const url = `findPrice/${sku}`;
    const response = await fetch(url);
    const json = await response.json();

    var productPrice = await json;

    if(typeof productPrice.price === 'number') {
      mealPrice += productPrice.price;
      //console.log("TOTAL:"+mealPrice);
    }

    document.getElementById('totalPrice').innerHTML = mealPrice.toFixed(2);

    return productPrice.price;

  } catch (error) {
    console.error(error);
  }
}