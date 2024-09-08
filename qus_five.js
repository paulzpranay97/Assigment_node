
const axios = require('axios');
const API_URL = 'https://dummyjson.com/products';

async function fetchProducts() {
  try {
    const response = await axios.get(API_URL);
    const products = response.data.products;

    if (!Array.isArray(products)) {
      throw new Error('Unexpected response format: "products" should be an array.');
    }

    const processedProducts = products.map(product => {
      const validId = typeof product.id === 'number';
      const validTitle = typeof product.title === 'string';
      const validDescription = typeof product.description === 'string';
      const validCategory = typeof product.category === 'string';
      const validPrice = typeof product.price === 'number';
      const validTags = Array.isArray(product.tags); 
      const validBrand = typeof product.brand === 'string' || product.brand === null; 
      
      if (validId && validTitle && validDescription && validCategory && validPrice && validTags) {
        const discountedPrice = product.discountPercentage
          ? (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)
          : product.price.toFixed(2);
        const averageRating = product.rating ? product.rating : null;

        return {
          id: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          tags: product.tags,
          brand: product.brand || 'Unknown Brand', 
          discountedPrice,
          averageRating
        };
      } else {
        throw new Error(`Product with id ${product.id} does not match the expected schema.`);
      }
    });

    console.log('Processed Products:', processedProducts);
  } catch (error) {
    console.error('Error fetching or processing products:', error.message);
  }
}

fetchProducts();

