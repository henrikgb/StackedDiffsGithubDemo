const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Example: /api/oneproduct?id=1
app.get('/api/oneproduct', (req, res) => {
  const { id } = req.query;
  fetch(`https://dummyjson.com/products/${id}`)
    .then(response => response.json())
    .then((data) => {
      const productDomain = {
        id: data.id,
        name: data.title,
        price: data.price,
        category: data.category,
        imageUrl: data.thumbnail,
        inStock: data.stock > 0
      };
      res.json(productDomain);
    })
    .catch(error => {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    });
});

    

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});