import React, { useState, useEffect } from 'react';
import useFoodItems from '../hooks/useFoodItems';
import PayTMImage from '../assets/paytm.png';
import GPayImage from '../assets/gpay.png';
import config from '../config';
import './Checkout.css';

const Checkout = ({ cart, onUpdateCart }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const { foodItems, loading } = useFoodItems();
  const [paymentDetails, setPaymentDetails] = useState({
    paytmNumber: '',
    gpayUpi: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    let time = 15;

    if (currentHour >= 8 && currentHour < 10) {
      time = 15;
    } else if (currentHour >= 10 && currentHour < 12) {
      time = 30;
    } else if (currentHour >= 12 && currentHour < 15) {
      time = 45;
    } else if (currentHour >= 15 && currentHour < 17) {
      time = 20;
    } else if (currentHour >= 17 && currentHour < 18) {
      time = 10;
    }

    setEstimatedTime(time);
  }, []);

  const calculateTotals = () => {
    let subtotal = 0;
    const cartItems = [];

    Object.entries(cart).forEach(([key, item]) => {
      const foodItem = foodItems.find(f => f.id === item.foodId);
      if (foodItem) {
        const itemTotal = foodItem.price * item.quantity;
        subtotal += itemTotal;
        cartItems.push({
          ...foodItem,
          quantity: item.quantity,
          total: itemTotal,
          hasExtra: item.hasExtra
        });
      }
    });

    const tax = subtotal * 0.15;
    const total = Math.floor(subtotal + tax);
    const points = Math.floor(subtotal / 10);

    return { cartItems, subtotal, tax, total, points };
  };

  const { cartItems, subtotal, tax, total, points } = calculateTotals();

  const handlePaymentChange = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    setPaymentDetails({
      paytmNumber: '',
      gpayUpi: '',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: ''
    });
  };

  const handleInputChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePay = async () => {
    try {
      const orderData = {
        items: Object.entries(cart).map(([key, item]) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          hasExtra: item.hasExtra || false
        })),
        total_amount: subtotal,
        tax_amount: tax,
        grand_total: total,
        points_earned: points,
        estimated_time: estimatedTime,
        payment_method: selectedPayment,
        payment_details: paymentDetails
      };

      const response = await fetch(`${config.API_BASE_URL}/api/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Order placed successfully! Order Number: ${data.order.order_number}`);
        onUpdateCart({});
        window.location.href = '/orders';
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.error}`);
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  const isPaymentDetailsComplete = () => {
    switch (selectedPayment) {
      case 'paytm':
        return paymentDetails.paytmNumber.length >= 10;
      case 'gpay':
        return paymentDetails.gpayUpi.includes('@');
      case 'card':
        return paymentDetails.cardNumber.length >= 16 && 
               paymentDetails.cardName.length > 0 && 
               paymentDetails.cardExpiry.length >= 5 && 
               paymentDetails.cardCvv.length >= 3;
      case 'cash':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h1 className="checkout-title">Checkout</h1>
        
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Taxes (15%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="points-info">
            <p>You will be earning <strong>{points} points</strong> on this order</p>
          </div>
          
          <div className="estimated-time">
            <p>Your order will be ready in: <strong>{estimatedTime} minutes</strong></p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-section">
          <h2>Payment Method</h2>
          
          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="paytm"
                name="payment"
                value="paytm"
                checked={selectedPayment === 'paytm'}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
                             <label htmlFor="paytm" className="payment-label">
                 <div className="payment-icon">
                   <img src={PayTMImage} alt="PayTM" />
                 </div>
                 <div className="payment-info">
                   <div className="payment-name">PayTM</div>
                   <div className="payment-desc">Pay using your PayTM wallet</div>
                 </div>
               </label>
            </div>

            <div className="payment-option">
              <input
                type="radio"
                id="gpay"
                name="payment"
                value="gpay"
                checked={selectedPayment === 'gpay'}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
                             <label htmlFor="gpay" className="payment-label">
                 <div className="payment-icon">
                   <img src={GPayImage} alt="Google Pay" />
                 </div>
                 <div className="payment-info">
                   <div className="payment-name">Google Pay</div>
                   <div className="payment-desc">Pay using UPI ID</div>
                 </div>
               </label>
            </div>

            <div className="payment-option">
              <input
                type="radio"
                id="card"
                name="payment"
                value="card"
                checked={selectedPayment === 'card'}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
              <label htmlFor="card" className="payment-label">
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <div className="payment-name">Credit/Debit Card</div>
                  <div className="payment-desc">Pay using your card</div>
                </div>
              </label>
            </div>

            <div className="payment-option">
              <input
                type="radio"
                id="cash"
                name="payment"
                value="cash"
                checked={selectedPayment === 'cash'}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
                             <label htmlFor="cash" className="payment-label">
                 <div className="payment-icon">💵</div>
                 <div className="payment-info">
                   <div className="payment-name">Cash on Pickup</div>
                   <div className="payment-desc">Pay when you collect your order</div>
                 </div>
               </label>
            </div>
          </div>

          {/* Payment Details Forms */}
          {selectedPayment === 'paytm' && (
            <div className="payment-form">
              <label htmlFor="paytmNumber">PayTM Mobile Number</label>
              <input
                type="tel"
                id="paytmNumber"
                placeholder="Enter your PayTM registered mobile number"
                value={paymentDetails.paytmNumber}
                onChange={(e) => handleInputChange('paytmNumber', e.target.value)}
              />
            </div>
          )}

          {selectedPayment === 'gpay' && (
            <div className="payment-form">
              <label htmlFor="gpayUpi">UPI ID</label>
                             <input
                 type="text"
                 id="gpayUpi"
                 placeholder="Enter your UPI ID (e.g., user@okhdfcbank)"
                 value={paymentDetails.gpayUpi}
                 onChange={(e) => handleInputChange('gpayUpi', e.target.value)}
               />
            </div>
          )}

          {selectedPayment === 'card' && (
            <div className="payment-form">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                maxLength="19"
              />
              
              <label htmlFor="cardName">Cardholder Name</label>
              <input
                type="text"
                id="cardName"
                placeholder="Enter cardholder name"
                value={paymentDetails.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
              />
              
              <div className="card-row">
                <div className="card-field">
                  <label htmlFor="cardExpiry">Expiry Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={paymentDetails.cardExpiry}
                    onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                    maxLength="5"
                  />
                </div>
                <div className="card-field">
                  <label htmlFor="cardCvv">CVV</label>
                  <input
                    type="text"
                    id="cardCvv"
                    placeholder="123"
                    value={paymentDetails.cardCvv}
                    onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPayment === 'cash' && (
            <div className="payment-form">
              <div className="cash-info">
                <p>You will pay ₹{total.toFixed(2)} when you collect your order.</p>
                <p>Please have exact change ready.</p>
              </div>
            </div>
          )}
        </div>

        {/* Pay Button */}
        <button 
          className={`pay-btn ${!isPaymentDetailsComplete() ? 'disabled' : ''}`}
          onClick={handlePay}
          disabled={!isPaymentDetailsComplete()}
        >
          Pay ₹{total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
