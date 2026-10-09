import './App.css'
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
};

const PAGE_SIZE = 10;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pageProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      setProducts(await response.json());
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    setLoading(true);
    setError("");
    fetchProducts();
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data: Product[]) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'An unknown error occurred');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function goToPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const firstItem = products.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, products.length);

  return (
    <section id="center">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
        <h1>Products</h1>

        {loading && <p>Loading products...</p>}

        {error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <p style={{ color: 'red', margin: 0 }}>{error}</p>
            <button onClick={retry}>Try again</button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <p style={{ margin: 0 }}>
              Showing {firstItem}-{lastItem} of {products.length}
            </p>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {pageProducts.map((p) => (
                <li
                  key={p.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <img src={p.imageUrl} alt={p.name} width={120} height={120} loading="lazy" />
                  <strong style={{ color: 'var(--text-h)' }}>{p.name}</strong>
                  <span>{p.category}</span>
                  <span style={{ color: 'var(--text-h)' }}>${p.price.toFixed(2)}</span>
                  <span style={{ color: p.inStock ? 'green' : 'red', fontSize: '0.85em' }}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </li>
              ))}
            </ul>

            <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => goToPage(1)} disabled={page === 1} aria-label="First page">«</button>
              <button onClick={() => goToPage(page - 1)} disabled={page === 1}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</button>
              <button onClick={() => goToPage(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
            </nav>
          </>
        )}
      </div>
    </section>
  )
}

export default App
