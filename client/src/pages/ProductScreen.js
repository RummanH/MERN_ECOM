import React from 'react'
import { useParams } from 'react-router-dom'

const ProductScreen = () => {
  const params = useParams()
  const { slug } = params
  return (
    <>
      <h1>{slug}</h1>
    </>
  )
}

export default ProductScreen
