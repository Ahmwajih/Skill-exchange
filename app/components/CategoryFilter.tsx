// CategoryFilter.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory } from '@/lib/';
import { RootState } from '@/store'; // Make sure to import the RootState
import Card from './Card'; // Assuming you have a Card component
import Slider from 'react-slick'; // Assuming you're using react-slick for the slider

const CategoryFilter: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.category.categories);
  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
  const allCards = useSelector((state: RootState) => state.cards); // Assuming your cards are in a 'cards' slice
  const filteredCards = selectedCategory
    ? allCards.filter((card) => card.category === selectedCategory)
    : allCards;

  const handleCategoryClick = (category: string) => {
    dispatch(setSelectedCategory(category)); // Dispatch action to set selected category
  };

  return (
    <div className="category-filter">
      {/* Category Buttons */}
      <div className="category-buttons flex gap-4 mb-6">
        <button
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => handleCategoryClick('')}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Cards Slider */}
      <Slider {...sliderSettings}>
        {filteredCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </Slider>
    </div>
  );
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export default CategoryFilter;
