import React from "react";
import KetoRecipeCard from "./KetoRecipeCard";

const KetoRecipeGrid = ({ recipes }) => {
  return (
    <div className="container py-4">
      <div className="row">
        {recipes.map((recipe, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
            <KetoRecipeCard {...recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KetoRecipeGrid;
