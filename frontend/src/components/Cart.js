import React from 'react';

const Cart = ({ cart, setCart, updateItemQuantity }) => {
  return (
    <div className="cart">
      <h3>Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              {/* Minus button is aligned to the left of the item name */}
              <button 
                className="minus" 
                onClick={() => updateItemQuantity(item.id, 'decrease')}
              >
                -
              </button>
              
              {/* Item Name in the center */}
              <span>{item.name} x {item.quantity}</span>

              {/* Plus button is aligned to the right of the item name */}
              <button 
                className="plus" 
                onClick={() => updateItemQuantity(item.id, 'increase')}
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;