import React from 'react'
import { Link } from 'react-router-dom'
import data from '../services/data'

const HomeScreen = () => {
  return (
    <>
      <h1>Featured Products</h1>
      <div className="products">
        {data.products.map((prod) => {
          return (
            <div key={prod._id} className="product">
              <Link to={`/product/${prod.slug}`}>
                <img src={prod.image} alt={prod.name} />
              </Link>
              <div className="product-info">
                <Link to={`/product/${prod.slug}`}>
                  <p>{prod.name}</p>
                </Link>
                <p>
                  <strong>${prod.price}</strong>
                </p>
                <button>Add to Cart</button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default HomeScreen
