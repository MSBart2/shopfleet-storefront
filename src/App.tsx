import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ShoppingCart, Package, User } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  inventory: number
  category: string
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products/')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-8">Loading products...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold">${(product.price / 100).toFixed(2)}</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">{product.inventory} in stock</p>
        </div>
      ))}
    </div>
  )
}

function Header() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" />
          ShopFleet
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:underline">Products</Link>
          <Link to="/cart" className="flex items-center gap-1 hover:underline">
            <ShoppingCart className="w-5 h-5" />
            Cart
          </Link>
          <Link to="/account" className="flex items-center gap-1 hover:underline">
            <User className="w-5 h-5" />
            Account
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Cart() {
  return (
    <div className="text-center py-12">
      <ShoppingCart className="w-16 h-16 mx-auto text-gray-300" />
      <h2 className="text-xl mt-4">Your cart is empty</h2>
      <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
        Continue shopping
      </Link>
    </div>
  )
}

function Account() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Sign In</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
