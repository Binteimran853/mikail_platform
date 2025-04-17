import React, { useState } from 'react';
import axios from 'axios';  // Import axios to make HTTP requests
import Cart from './Cart'; // Make sure Cart component is correctly imported
import menuData from '../menu.json'; // Import the menu.json file
import { useUser } from '../Context/UserContext';
import '../styles.css';

const MenuPage = () => {
    const {
      isLoggedIn, setIsLoggedIn,
      userRole, setUserRole,
      
    } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('Popular Dish');
  const [cart, setCart] = useState([]);
  const [newItemName, setNewItemName] = useState('');

  // Adding a custom item to cart
  const addItemToCart = () => {
    if (newItemName.trim()) {
      setCart([...cart, { id: Date.now(), name: newItemName, quantity: 1, price: 5 }]);
      setNewItemName('');
    }
  };

  // Update quantity for each item in cart
  const updateItemQuantity = (itemId, operation) => {
    setCart(
      cart
        .map((item) =>
          item.id === itemId
            ? {
              ...item,
              quantity:
                operation === 'increase'
                  ? item.quantity + 1
                  : Math.max(item.quantity - 1, 0),
            }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Extract categories from menuData
  const categories = menuData.reduce((acc, item) => {
    if (!acc.includes(item.Subcategory)) {
      acc.push(item.Subcategory);
    }
    return acc;
  }, []);

  // Filter items by category
  const itemsInCategory = menuData.filter(
    (item) => item.Subcategory === selectedCategory
  );

  // Add item from menu to cart
  const addMenuItemToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.ID);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.ID
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          id: item.ID,
          quantity: 1,
          name: item['Item Name'],
          price: item['Price (£)'],
          description: item.Description,
          allergyInfo: item['Allergy Info'],
          spiceLevel: item['Spice Level (1-5)'],
          calories: item['Calories (per serving)'],
        },
      ]);
    }
  };

  // Handle Send to Supplier action
  const handleSendToSupplier = async () => {
    const orderItems = cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price, // Include price! Your API expects it
    }));

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/orders/',
        {
          items: orderItems,
          total_price: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  //  Token is added here
            "Content-Type": 'Application/json'
          }
        }
      );
      const response2 = await axios.post('http://localhost:8000/api/order-send-suppliers/', {},

        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token is added here
            "Content-Type": 'Application/json'
          }
        }
      )

      console.log("Success:", response2.data);


     alert('Order Send to supplier')
      console.log('Order sent to supplier:', response);
    } catch (error) {
      console.error('Error sending order:', error.response?.data || error.message);
    }
  };

  // Handle print label action
  const handlePrintLabel = () => {
    const printContent = cart.map((item) => `
      <div>
        <h2>${item.name} - £${item.price}</h2>
        <p>Description: ${item.description}</p>
        <p>Allergy Info: ${item.allergyInfo}</p>
        <p>Spice Level: ${item.spiceLevel}</p>
        <p>Calories: ${item.calories}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
    `).join('');

    const printWindow = window.open();
    printWindow.document.write(`
      <html>
        <head><title>Print Label</title></head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();

    // Clear the cart after printing
    setTimeout(() => {
      setCart([]);
    }, 1000);
  };

  return (
    <div className="App">
      {/* Header Container */}
      <div className="header-container">
        {/* Add Item Section */}
        <div className="add-item-container">
          <div className="add-item-section">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter item name"
              className="add-item-input"
            />
            <button onClick={addItemToCart} className="add-item-button">
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="menu-page-container">
        {/* Categories Column */}
        <div className="categories-column">
          <h3>Categories</h3>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="category-button"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Items Column */}
        <div className="items-column">
          <h3>Items in {selectedCategory}</h3>
          <div className="items-grid">
            {itemsInCategory.map((item) => (
              <div key={item.ID} className="item-button-container">
                <button
                  onClick={() => addMenuItemToCart(item)}
                  className="item-button"
                >
                  {item['Item Name']} - £{item['Price (£)']}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Column */}
        <div className="cart-column">
          <Cart
            cart={cart}
            setCart={setCart}
            updateItemQuantity={updateItemQuantity}
          />

          {userRole !== 'supplier' ? (
            <>
              <button onClick={handlePrintLabel} className="print-label">
                Print Label
              </button>
              <button onClick={handleSendToSupplier} className="send-to-supplier">
                Send to Supplier
              </button>
            </>
          ) : (
            <p className="info-text">Suppliers cannot place or send orders.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default MenuPage;
