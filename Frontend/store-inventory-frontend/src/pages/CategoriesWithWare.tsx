import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WaresByFilter from "../components/WaresFilterComponent.tsx";
import axios from "axios";

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/categories/${categoryId}/`)
      .then((res) => setCategoryName(res.data.name))
      .catch(() => setCategoryName(`Category ${categoryId}`));
  }, [categoryId]);

  return (
    <WaresByFilter
      title={`Wares in ${categoryName}`}
      fetchUrl={`http://localhost:8000/api/wares/?category=${categoryId}`}
    />
  );
};

export default CategoryDetail;
