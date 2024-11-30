import React, { useEffect, useRef } from "react";

const InfiniteScrollingCategories = ({ categories, handleCategoryClick }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      const totalWidth = scrollRef.current.scrollWidth;
      
      // Animate scrolling infinitely
      const scrollAnimation = () => {
        if (scrollRef.current) {
          if (scrollRef.current.scrollLeft >= totalWidth / 2) {
            scrollRef.current.scrollLeft = 0; // Restart scroll once it reaches halfway
          } else {
            scrollRef.current.scrollLeft += 1; // Scroll 1px every frame
          }
        }
      };

      const interval = setInterval(scrollAnimation, 10); // Adjust speed here

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, []);

  return (
    <div className="overflow-x-hidden relative">
      <div className="flex space-x-6 pb-4 animate-scroll" ref={scrollRef}>
        {/* Infinite scroll content */}
        <div className="flex space-x-6">
          {categories.map((category, index) => (
            <button
              key={index}
              className="py-2 px-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Duplicate the categories for continuous scrolling */}
        <div className="flex space-x-6">
          {categories.map((category, index) => (
            <button
              key={index + categories.length}
              className="py-2 px-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollingCategories;
