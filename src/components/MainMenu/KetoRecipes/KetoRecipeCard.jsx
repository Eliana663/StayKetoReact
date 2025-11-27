import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const KetoRecipeCard = ({ image, title, description, ingredients }) => {
  return (
    <div className="card mb-4 shadow-sm h-100">
      <img
        src={image}
        alt={title}
        className="card-img-top"
        style={{
          objectFit: "cover", 
          width: "100%",
          height: "200px",   
          display: "block",
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-center fw-bold">{title}</h5>
        <p className="card-text text-muted">{description}</p>
        <h6 className="fw-semibold mt-2">Ingredientes:</h6>
        <ul className="list-group list-group-flush flex-grow-1">
          {ingredients.map((item, index) => (
            <li key={index} className="list-group-item">
              🥥 {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KetoRecipeCard;
