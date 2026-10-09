import './App.css'
import { useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
};

function App() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function loadProduct() {
    setLoadingProduct(true);
    setError("");
    try {
      // set the product ID to 1 for demonstration purposes
      const response = await fetch('/api/oneproduct?id=1');
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      if(err instanceof Error) {
        setError(err.message);
      }
      else{
        setError('An unknown error occurred');
      }
    } finally {
      setLoadingProduct(false);
    }
  }

  return (
    <>
      <section id="center">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <h1>Simple Frontend Demo with Nodejs BFF</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button onClick={loadProduct} disabled={loadingProduct}>
                {loadingProduct ? 'Loading...' : 'Load Product'}
              </button>
              <button
                onClick={() => { setProduct(null); setError(""); }}
                disabled={loadingProduct || !product}
              >
                Clear Product
              </button>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {product && (
            <div>
              <h2>{product.name}</h2>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
              <img src={product.imageUrl} alt={product.name} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default App
