import React, { useState, useEffect } from 'react';
import './UsersDashboard.css';

const UsersDashboard = () => {
  const [menuData, setMenuData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Dishes');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [cart, setCart] = useState([]);

  const categories = ['Breakfast', 'Lunch', 'Main Courses', 'Beverages', 'Desserts', 'All Dishes'];
  const filters = ['Vegetarian', 'Dairy-Free', 'Non-Veg', 'Vegan'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Sample dishes data (replace with actual API call)
  const sampleDishes = [
    {
      id: 1,
      name: 'Cheese Omelette',
      description: 'A fluffy omelette with melted cheese',
      image: 'https://via.placeholder.com/150',
      category: 'Breakfast',
      filter: 'Vegetarian',
      mealType: 'Breakfast',
      price: 12.99,
      popular: false
    },
    {
      id: 2,
      name: 'Ribeye Steak',
      description: 'Juicy ribeye steak grilled to perfection',
      image: 'https://via.placeholder.com/150',
      category: 'Main Courses',
      filter: 'Non-Veg',
      mealType: 'Dinner',
      price: 28.99,
      popular: false
    },
    {
      id: 3,
      name: 'Chocolate Cake',
      description: 'Rich and moist chocolate cake',
      image: 'https://via.placeholder.com/150',
      category: 'Desserts',
      filter: 'Vegetarian',
      mealType: 'Dinner',
      price: 8.99,
      popular: true
    },
    {
      id: 4,
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with caesar dressing',
      image: 'https://via.placeholder.com/150',
      category: 'Lunch',
      filter: 'Vegetarian',
      mealType: 'Lunch',
      price: 14.99,
      popular: true
    }
  ];

  useEffect(() => {
    // Fetch menu data from backend
    const fetchMenuData = async () => {
      try {
        // Updated API endpoint to match your server routes
        const response = await fetch('http://localhost:5000/api/menu');
        const data = await response.json();
        
        // Transform the data to match your component's expected structure
        const transformedData = data.map(item => ({
          id: item._id,
          name: item.name,
          description: item.description || 'Delicious dish',
          image: item.imageUrl || 'https://via.placeholder.com/150',
          category: 'Main Courses', // You'll need to add category to your MenuItem model
          filter: 'Non-Veg', // You'll need to add filter to your MenuItem model
          mealType: 'Dinner', // You'll need to add mealType to your MenuItem model
          price: item.price,
          popular: false // You'll need to add popular to your MenuItem model
        }));
        
        setMenuData(transformedData);
      } catch (error) {
        console.error('Error fetching menu:', error);
        // Use sample data as fallback
        setMenuData(sampleDishes);
      }
    };

    fetchMenuData();
  }, []);

  const filteredDishes = menuData.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Dishes' || dish.category === selectedCategory;
    const matchesFilter = !selectedFilter || dish.filter === selectedFilter;
    const matchesMealType = !selectedMealType || dish.mealType === selectedMealType;
    
    return matchesSearch && matchesCategory && matchesFilter && matchesMealType;
  });

  const popularDishes = menuData.filter(dish => dish.popular);
  const availableDishes = filteredDishes.filter(dish => !dish.popular);

  const addToCart = (dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...dish, quantity: 1 }];
    });
  };

  const DishCard = ({ dish, showAddToCart = true }) => (
    <div className="dish-card">
      <img src={dish.image} alt={dish.name} />
      <div className="dish-info">
        <p><strong>{dish.name}</strong></p>
        <p className="dish-description">{dish.description}</p>
        <p className="dish-price">R{dish.price}</p>
        {showAddToCart && (
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(dish)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="users-dashboard">
      <h2>Egumeni Eats</h2>
      
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="filters">
        <button
          className={!selectedFilter ? 'active' : ''}
          onClick={() => setSelectedFilter('')}
        >
          All
        </button>
        {filters.map(filter => (
          <button
            key={filter}
            className={selectedFilter === filter ? 'active' : ''}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="meal-type">
        <button
          className={!selectedMealType ? 'active' : ''}
          onClick={() => setSelectedMealType('')}
        >
          All Meals
        </button>
        {mealTypes.map(mealType => (
          <button
            key={mealType}
            className={selectedMealType === mealType ? 'active' : ''}
            onClick={() => setSelectedMealType(mealType)}
          >
            {mealType}
          </button>
        ))}
      </div>

      <h3 className="section-title">Available Dishes</h3>
      <div className="available-dishes">
        {availableDishes.length > 0 ? (
          availableDishes.map(dish => (
            <DishCard key={dish.id} dish={dish} />
          ))
        ) : (
          <p>No dishes found matching your criteria.</p>
        )}
      </div>

      <h3 className="section-title">Popular Dishes</h3>
      <div className="popular-dishes">
        {popularDishes.map(dish => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>

      <div className="button-section">
        <button>Reorder</button>
        <button>In-room Service</button>
        <button>View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default UsersDashboard;
