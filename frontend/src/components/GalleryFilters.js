import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

function GalleryFilters({ categories, onFilterChange }) {
  const [active, setActive] = useState("All");

  const handleClick = (category) => {
    setActive(category);
    onFilterChange(category);
  };

  return (
    <div className="d-flex justify-content-center my-4 flex-wrap gap-3">
      {categories.map((cat) => (
        <Button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`filter-btn px-4 py-2 rounded-pill ${
            active === cat ? "active-filter" : "btn-light"
          }`}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}

export default GalleryFilters;
