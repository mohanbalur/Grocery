import { useEffect, useState } from "react";
import { fetchCategories } from "../api/category.api";
import { useNavigate } from "react-router-dom";


const CategoryHamburger = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res.data));
  }, []);

  const handleClick = (id) => {
    navigate(`/category/${id}`);
    onClose(); // close menu after click
  };

  return (
    <div className="hamburger-menu">
      <h4>Categories</h4>

      {categories.map((cat) => (
        <div
          key={cat._id}
          onClick={() => handleClick(cat._id)}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default CategoryHamburger;
