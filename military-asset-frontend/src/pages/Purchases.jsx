import React, { useState } from "react";
import axios from "axios";

const Purchases = () => {
  const [formData, setFormData] = useState({
    base: "",
    assetType: "",
    quantity: "",
  });

  const [filter, setFilter] = useState({
    base: "",
    assetType: "",
    startDate: "",
    endDate: "",
  });

  const [historicalData, setHistoricalData] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      base: formData.base,
      assetType: formData.assetType,
      quantity: Number(formData.quantity),
    };

    try {
      await axios.post("https://ak-47-1.onrender.com/api/purchases", payload);
      alert("Purchase recorded successfully!");
      setFormData({ base: "", assetType: "", quantity: "" });
    } catch (error) {
      console.error("Error recording purchase:", error.response?.data || error.message);
      alert("Error recording purchase. Check fields and try again.");
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const params = {};
      if (filter.base) params.base = filter.base;
      if (filter.assetType) params.assetType = filter.assetType;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;

      const res = await axios.get("http://localhost:3000/api/purchases", { params });
      setHistoricalData(res.data);
    } catch (error) {
      console.error("Error fetching purchases:", error.response?.data || error.message);
      alert("Error fetching historical data.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Record a Purchase</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="base"
          placeholder="Base"
          value={formData.base}
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
        <button type="submit">Record Purchase</button>
      </form>

      <hr />

      <h2>View Historical Purchases</h2>
      <div>
        <input
          type="text"
          name="base"
          placeholder="Base"
          value={filter.base}
          onChange={handleFilterChange}
        />{" "}
        <input
          type="text"
          name="assetType"
          placeholder="Asset Type"
          value={filter.assetType}
          onChange={handleFilterChange}
        />{" "}
        <input
          type="date"
          name="startDate"
          value={filter.startDate}
          onChange={handleFilterChange}
        />{" "}
        <input
          type="date"
          name="endDate"
          value={filter.endDate}
          onChange={handleFilterChange}
        />{" "}
        <button onClick={fetchHistoricalData}>Fetch History</button>
      </div>

      <br />

      {historicalData.length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>
              <th>Base</th>
              <th>Asset Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {historicalData.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.base}</td>
                <td>{entry.assetType}</td>
                <td>{entry.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No purchase records found.</p>
      )}
    </div>
  );
};

export default Purchases;
