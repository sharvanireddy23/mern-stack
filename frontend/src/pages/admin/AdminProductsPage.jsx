import React from 'react'
import ProductsPageComponent from './components/ProductsPageComponent'
import axios from 'axios'
const AdminProductsPage = () => {
  const fetchProducts = async()=>{
    const {data} = await axios.get("/api/products/admin")
    // console.log("admin products" ,data)
    return data
  }
  fetchProducts()

  const deleteProduct = async(productId)=>{
    console.log(productId)
    const {data} = await axios.delete(`/api/products/admin/${productId}`)
    return data
  }
  // deleteProduct()
  return (
    <ProductsPageComponent fetchProducts= {fetchProducts} deleteProduct={deleteProduct} />
  )
}

export default AdminProductsPage