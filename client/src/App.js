import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import ProductScreen from './pages/ProductScreen'

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">Rumman's Shop</Link>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
