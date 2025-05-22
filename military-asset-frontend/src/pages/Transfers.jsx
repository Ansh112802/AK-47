import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Transfers = () => {
  const [formData, setFormData] = useState({
    fromBase: "",
    toBase: "",
    assetType: "",
    quantity: "",
  });

  const [filters, setFilters] = useState({
    date: "",
    assetType: "",
  });

  const [transferHistory, setTransferHistory] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // ✅ Memoized function to avoid re-creating it every render
  const fetchTransfers = useCallback(async () => {
    try {
      const params = {};
      if (filters.date) params.date = filters.date;
      if (filters.assetType) params.assetType = filters.assetType;

      const response = await axios.get("https://ak-47-1.onrender.com/api/transfers", {
        params,
      });
      setTransferHistory(response.data);
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  }, [filters.date, filters.assetType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://ak-47-1.onrender.com/api/transfers", {
        ...formData,
        quantity: Number(formData.quantity),
      });
      alert("Transfer recorded successfully!");
      setFormData({ fromBase: "", toBase: "", assetType: "", quantity: "" });
      fetchTransfers(); // ✅ Safe to call
    } catch (error) {
      console.error("Transfer error:", error);
      alert("Error recording transfer.");
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransfers();
  };

  // ✅ No more ESLint warning!
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Record a Transfer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fromBase"
          placeholder="From Base"
          value={formData.fromBase}
          onChange={handleChange}
        /><br /><br />
        <input
          type="text"
          name="toBase"
          placeholder="To Base"
          value={formData.toBase}
          onChange={handleChange}
        /><br /><br />
        <input
          type="text"
          name="assetType"
          placeholder="Asset Type"
          value={formData.assetType}
          onChange={handleChange}
        /><br /><br />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        /><br /><br />
        <button type="submit">Transfer</button>
      </form>

      <hr />

      <h2>Transfer History</h2>
      <form onSubmit={handleFilterSubmit}>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        &nbsp;
        <input
          type="text"
          name="assetType"
          placeholder="Filter by Asset Type"
          value={filters.assetType}
          onChange={handleFilterChange}
        />
        &nbsp;
        <button type="submit">Apply Filters</button>
      </form>

       <button
    type="button"
    onClick={() => {
      setFilters({ date: "", assetType: "" });
      fetchTransfers();
    }}
  >
    Show All
  </button>

      <ul style={{ marginTop: "20px" }}>
        {transferHistory.length === 0 ? (
          <li>No transfer records found.</li>
        ) : (
          transferHistory.map((transfer) => (
            <li key={transfer._id}>
              <strong>{transfer.assetType}</strong> - {transfer.quantity} units from <b>{transfer.fromBase}</b> to <b>{transfer.toBase}</b> on{" "}
              {new Date(transfer.date).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Transfers;
