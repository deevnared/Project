import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://20.244.56.144/test/register';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(API_URL);
      setProducts(response.data);
      setFilteredProducts(response.data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const uniqueCategories = new Set(products.map((product) => product.category));
    setCategories([...uniqueCategories]);

    const uniqueCompanies = new Set(products.map((product) => product.company));
    setCompanies([...uniqueCompanies]);
  }, [products]);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        (selectedCategory === '' || product.category === selectedCategory) &&
        (selectedCompany === '' || product.company === selectedCompany) &&
        (selectedRating === 0 || product.rating >= selectedRating) &&
        (selectedPriceRange === '' ||
          (selectedPriceRange === 'low' && product.price <= 50) ||
          (selectedPriceRange === 'medium' && product.price > 50 && product.price <= 100) ||
          (selectedPriceRange === 'high' && product.price > 100))
    );
    setFilteredProducts(filtered);
  }, [
    products,
    selectedCategory,
    selectedCompany,
    selectedRating,
    selectedPriceRange,
  ]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  const handlePriceRangeChange = (event) => {
    setSelectedPriceRange(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredProducts.length / productsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="App">
      <h1>Top N Products</h1>

      <div className="filter-container">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label htmlFor="company">Company:</label>
        <select
          id="company"
          value={selectedCompany}
          onChange={handleCompanyChange}
        >
          <option value="">All</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <label htmlFor="rating">Rating:</label>
        <select
          id="rating"
          value={selectedRating}
          onChange={handleRatingChange}
        >
          <option value={0}>All</option>
          <option value={4}>4+</option>
          <option value={3}>3+</option>
          <option value={2}>2+</option>
        </select>

        <label htmlFor="price-range">Price Range:</label>
        <select
          id="price-range"
          value={selectedPriceRange}
          onChange={handlePriceRangeChange}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="product-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <p>Company: {product.company}</p>
            <p>Rating: {product.rating} stars</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
