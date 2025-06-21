import axios from "axios";
import React, { useEffect, useState } from "react";

const useGetTotalCount = () => {
  const [totalCount, setTotalCount] = useState({});
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/productsCount");
        setTotalCount(res.data);
      } catch (error) {
        console.error("Error fetching total count:", error);
      }
    };

    fetchCount();
  }, []);
  return totalCount;
};

export default useGetTotalCount;
