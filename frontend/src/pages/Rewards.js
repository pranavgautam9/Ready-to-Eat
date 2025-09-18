import React, { useState, useEffect } from 'react';
import useFoodItems from '../hooks/useFoodItems';
import config from '../config';
import './Rewards.css';

const Rewards = ({ cart, onUpdateCart, onCartUpdate, userType }) => {
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeemedReward, setRedeemedReward] = useState(null);
  const { foodItems } = useFoodItems();

  // Reward tiers configuration
  const rewardTiers = [
    {
      id: 'tier1',
      points: 500,
      title: '500 Points',
      items: [
        { id: 101, name: 'Samosa', quantity: 2, rewardId: 'samosa-500' },
        { id: 102, name: 'Kachori', quantity: 2, rewardId: 'kachori-500' }
      ]
    },
    {
      id: 'tier2',
      points: 1000,
      title: '1000 Points',
      items: [
        { id: 103, name: 'Veg Burger', quantity: 1, rewardId: 'burger-1000' },
        { id: 104, name: 'Hakka Noodles', quantity: 1, rewardId: 'noodles-1000' }
      ]
    },
    {
      id: 'tier3',
      points: 5000,
      title: '5000 Points',
      items: [
        { 
          id: 105, 
          name: 'Pav Bhaji + Lays + Coca Cola', 
          quantity: 1,
          rewardId: 'combo1-5000',
          isCombo: true,
          items: [
            { id: 4, name: 'Pav Bhaji', quantity: 1 },
            { id: 11, name: 'Lays Chips', quantity: 1 },
            { id: 13, name: 'Coca Cola', quantity: 1 }
          ]
        },
        { 
          id: 106, 
          name: 'Chole Bhature + Kurkure + Frooti', 
          quantity: 1,
          rewardId: 'combo2-5000',
          isCombo: true,
          items: [
            { id: 3, name: 'Chole Bhature', quantity: 1 },
            { id: 12, name: 'Kurkure', quantity: 1 },
            { id: 14, name: 'Frooti', quantity: 1 }
          ]
        }
      ]
    }
  ];

  // Fetch user points
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await fetch('${config.API_BASE_URL}/api/user/points', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserPoints(data.points || 0);
        } else {
          console.error('Failed to fetch user points');
          setUserPoints(0);
        }
      } catch (error) {
        console.error('Error fetching user points:', error);
        setUserPoints(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, []);

  // Check if user has redeemed any reward
  useEffect(() => {
    const checkRedeemedReward = () => {
      // Check if any reward item is in cart
      for (const tier of rewardTiers) {
        for (const item of tier.items) {
          const cartKey = `${item.id}`;
          if (cart[cartKey] && cart[cartKey].isReward) {
            setRedeemedReward(item.rewardId);
            return;
          }
        }
      }
      setRedeemedReward(null);
    };

    checkRedeemedReward();
  }, [cart]);

  // Calculate and update cart count whenever cart changes
  useEffect(() => {
    const total = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    if (onCartUpdate) {
      onCartUpdate(total);
    }
  }, [cart, onCartUpdate]);

  const handleRedeemReward = async (tier, item) => {
    if (userPoints < tier.points || redeemedReward) return;

    try {
      // Add reward item to cart (cart is an object with keys like "1", "2", etc.)
      const updatedCart = { ...cart };
      
      // Add the reward item as a single cart item
      const cartKey = `${item.id}`;
      updatedCart[cartKey] = {
        foodId: item.id,
        name: item.name,
        price: 0, // Free for rewards
        quantity: item.quantity, // Use the actual quantity from the reward item (2x for Samosa/Kachori)
        image: '/assets/samosa.jpg', // Default image, will be updated when food items are loaded
        isReward: true,
        rewardId: item.rewardId,
        rewardTier: tier.id,
        rewardPoints: tier.points
      };

      // Update cart
      onUpdateCart(updatedCart);

      // Update user points
      const newPoints = userPoints - tier.points;
      setUserPoints(newPoints);

      // Update points in backend
      await fetch('${config.API_BASE_URL}/api/user/points', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: newPoints })
      });

    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  const handleRemoveReward = async (rewardId) => {
    if (!redeemedReward || redeemedReward !== rewardId) return;

    try {
      // Find the reward item in cart
      let rewardItem = null;
      let rewardTier = null;
      
      for (const tier of rewardTiers) {
        for (const item of tier.items) {
          if (item.rewardId === rewardId) {
            rewardItem = item;
            rewardTier = tier;
            break;
          }
        }
        if (rewardItem) break;
      }

      if (!rewardItem || !rewardTier) return;

      // Remove reward item from cart
      const updatedCart = { ...cart };
      const cartKey = `${rewardItem.id}`;
      delete updatedCart[cartKey];

      // Update cart
      onUpdateCart(updatedCart);

      // Restore user points
      const newPoints = userPoints + rewardTier.points;
      setUserPoints(newPoints);

      // Update points in backend
      await fetch('${config.API_BASE_URL}/api/user/points', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: newPoints })
      });

    } catch (error) {
      console.error('Error removing reward:', error);
    }
  };

  const isItemDisabled = (tier, item) => {
    return userPoints < tier.points || (redeemedReward && redeemedReward !== item.rewardId);
  };

  const isItemRedeemed = (item) => {
    return redeemedReward === item.rewardId;
  };

  if (loading) {
    return (
      <div className="rewards-container">
        <div className="rewards-content">
          <div style={{color: 'white', textAlign: 'center', fontSize: '20px'}}>
            <p>Loading your rewards...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show message for guest users
  if (userType === 'guest') {
    return (
      <div className="rewards-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #05288D 0%, #9B1631 100%)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '120px',
        marginTop: '70px'
      }}>
        <div className="rewards-content" style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>
            🎁
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Rewards Not Available
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            You need to create an account to access rewards and earn points with your orders.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => window.location.href = '/register'}
              style={{
                background: 'linear-gradient(135deg, #05288D, #9B1631)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(5, 40, 141, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(5, 40, 141, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(5, 40, 141, 0.3)';
              }}
            >
              Create Account
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '2px solid #d1d5db',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e5e7eb';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f3f4f6';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rewards-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #05288D 0%, #9B1631 100%)',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginTop: '70px'
    }}>
      <div className="rewards-content" style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="balance-section" style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 className="balance-title" style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>Your Balance: {userPoints} points</h1>
        </div>

        <div className="rewards-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {rewardTiers.map((tier) => (
            <div key={tier.id} className="reward-card" style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              border: '3px solid transparent',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="reward-header" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '2px solid #f3f4f6'
              }}>
                <h3 className="reward-title" style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0'
                }}>{tier.title}</h3>
              </div>
              
              <div className="reward-items" style={{
                marginBottom: '24px'
              }}>
                {tier.items.map((item, index) => (
                  <div key={index} className="reward-item" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    marginBottom: '8px',
                    background: '#f0fdf4',
                    border: '1px solid #22c55e',
                    borderRadius: '8px',
                    minHeight: '48px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      flex: 1
                    }}>
                      <span className="item-quantity" style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        marginRight: '12px',
                        minWidth: '30px',
                        display: 'inline-block',
                        verticalAlign: 'middle'
                      }}>{item.quantity}x</span>
                      <span className="item-name" style={{
                        color: '#166534',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        lineHeight: '1.2'
                      }}>{item.name}</span>
                    </div>
                    {isItemRedeemed(item) ? (
                      <button 
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleRemoveReward(item.rewardId)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        style={{
                          background: isItemDisabled(tier, item) ? '#d1d5db' : '#22c55e',
                          color: isItemDisabled(tier, item) ? '#6b7280' : 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: isItemDisabled(tier, item) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        disabled={isItemDisabled(tier, item)}
                        onClick={() => handleRedeemReward(tier, item)}
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        <div className="rewards-disclaimer" style={{
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.85rem',
            margin: '0',
            fontStyle: 'italic'
          }}>Please note that only one reward can be redeemed at a time. Points are non-refundable and cannot be transferred.</p>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
