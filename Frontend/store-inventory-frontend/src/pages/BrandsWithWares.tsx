import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WaresByFilter from "../components/WaresFilterComponent.tsx";
import axios from "axios";

const BrandDetail = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/brands/${brandId}/`)
      .then((res) => setBrandName(res.data.name))
      .catch(() => setBrandName(`Brand ${brandId}`));
  }, [brandId]);

  return (
    <WaresByFilter
      title={`Wares for ${brandName}`}
      fetchUrl={`http://localhost:8000/api/wares/?brand=${brandId}`}
    />
  );
};

export default BrandDetail;
