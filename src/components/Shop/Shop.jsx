import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";
import useGetTotalCount from "../../hooks/useGetTotalCount";

const Shop = () => {
  const savedCart = useLoaderData();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(savedCart);
  const [currentPage, setCurrentPage] = useState(0);
  const { count } = useGetTotalCount();

  //   get number of page
  const [itemOfPages, setItemOfPage] = useState(10);
  const totalPage = Math.ceil(count / itemOfPages);
  const pages = [];
  for (let index = 0; index < totalPage; index++) {
    pages.push(index);
  }

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${currentPage}&limit=${itemOfPages}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemOfPages]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };
  const handlePageItem = (e) => {
    const val = parseInt(e.target.value);
    setItemOfPage(val);
    setCurrentPage(0);
  };
  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          {/* get as a child of Cart component */}
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>

      <div className="pagination">
        <button
          onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        {pages.map((page) => (
          <button
            className={currentPage === page ? "selected" : ""}
            onClick={() => setCurrentPage(page)}
            key={page}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() =>
            currentPage + 1 < totalPage ? setCurrentPage(currentPage + 1) : ""
          }
        >
          Next
        </button>
        <select value={itemOfPages} onChange={handlePageItem} name="" id="">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
