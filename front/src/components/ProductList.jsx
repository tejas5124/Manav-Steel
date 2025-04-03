import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProductList.css";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quotation, setQuotation] = useState([]); // State to hold products for quotation
  const [message, setMessage] = useState("");


  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://tejas.avishkar.digital/manav-steel/back/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
  );

  // Add selected product to quotation list
  const addToQuotation = (product) => {
    setQuotation((prevQuotation) => {
      const existingProductIndex = prevQuotation.findIndex(
        (item) => item.id === product.id
      );
  
      if (existingProductIndex !== -1) {
        const updatedQuotation = [...prevQuotation];
        updatedQuotation[existingProductIndex].quantity += 1;
        updatedQuotation[existingProductIndex].totalPrice =
          updatedQuotation[existingProductIndex].quantity * Number(updatedQuotation[existingProductIndex].price);
  
        showMessage(`${product.name} added to quotation.`);
        return updatedQuotation;
      } else {
        showMessage(`${product.name} added to quotation.`);
        return [...prevQuotation, { ...product, quantity: 1, totalPrice: Number(product.price) }];
      }
    });
  };
  
  const removeFromQuotation = (productId) => {
    const removedProduct = quotation.find((item) => item.id === productId);
    setQuotation((prevQuotation) => prevQuotation.filter((item) => item.id !== productId));
  
    if (removedProduct) {
      showMessage(`${removedProduct.name} removed from quotation.`);
    }
  };
  
  // Function to show message with fade-out effect
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 2000); // Message disappears after 2 seconds
  };
  
  

  const getTotalPrice = () => {
    return quotation.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };
  

  // Function to handle "Send Quotation" button click
  const handleSendQuotation = () => {
    // Navigate to the SendQuotation page and pass the quotation data
    navigate("/send-quotation", { state: { quotation } });
  };
  

  return (
    <div className="product-list-container">
      <Header />
      {message && <div className="message-box">{message}</div>}
      {/* Search Bar */}
      <header className="product-header">
        <h1>Steel Products</h1>
        <input
          type="text"
          placeholder="Search Products..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </header>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image ? `https://tejas.avishkar.digital/manav-steel/back/uploads/images/${product.image}` : "default-image.jpg"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹{product.price}</p>
                <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </p>
              </div>
              <button className="view-details-btn" onClick={() => setSelectedProduct(product)}>
                View Details
              </button>
              <button className="add-to-quotation-btn" onClick={() => addToQuotation(product)}>
                Add to Quotation
              </button>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="product-details-modal">
          <div className="modal-content">
            <div className="modal-left">
              {/* Product Information */}
              <h2>Product Details</h2>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
              <p><strong>Grade:</strong> {selectedProduct.grade}</p>
              <p><strong>Thickness:</strong> {selectedProduct.thickness} mm</p>
              <p><strong>Weight:</strong> {selectedProduct.weight} kg</p>
              <p><strong>Location:</strong> {selectedProduct.location}</p>
              <p><strong>Manufacturer:</strong> {selectedProduct.manufacturer}</p>
              <p><strong>Certification:</strong> {selectedProduct.certification}</p>
              <p><strong>Added On:</strong> {new Date(selectedProduct.created_at).toLocaleString()}</p>
              <button className="close-btn" onClick={() => setSelectedProduct(null)}>
                Close
              </button>
            </div>

            <div className="modal-right">
              {/* Product Image */}
              <img
                src={selectedProduct.image ? `https://tejas.avishkar.digital/manav-steel/back/uploads/images/${selectedProduct.image}` : "default-image.jpg"}
                alt={selectedProduct.name}
                className="modal-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quotation Table */}
      {quotation.length > 0 && (
        <div className="quotation-table-container">
          <h2>Quotation</h2>
          <table className="quotation-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {quotation.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.totalPrice}</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromQuotation(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Quotation Summary */}
          <div className="quotation-summary">
            <p><strong>Total Products:</strong> {quotation.length}</p>
            <p><strong>Total Price:</strong> ₹{getTotalPrice()}</p>
          </div>

          {/* Send Quotation Button */}
          <button className="send-quotation-btn" onClick={handleSendQuotation}>
            Send Quotation
          </button>

        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
