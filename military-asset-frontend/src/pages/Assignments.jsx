import React, { useState } from "react";
import axios from "axios";
import "./Assignments.css"; 

const Assignments = () => {
  const [formData, setFormData] = useState({
    personnelId: "",
    assetType: "",
    assignedQuantity: "",
    expendedQuantity: "",
  });

  const [allData, setAllData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.personnelId || !formData.assetType) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await axios.post("https://ak-47-1.onrender.com/api/assignments", formData);
      alert("Assignment recorded successfully!");
      setFormData({
        personnelId: "",
        assetType: "",
        assignedQuantity: "",
        expendedQuantity: "",
      });
      if (showAll) {
        fetchAllData(); // Refresh if data is visible
      }
    } catch (error) {
      console.error("Submission Error:", error.response || error);
      alert("Error recording assignment.");
    }
  };

  const fetchAllData = async () => {
    try {
      const res = await axios.get("https://ak-47-1.onrender.com/api/assignments");
      setAllData(res.data);
    } catch (error) {
      console.error("Fetch Error:", error.response || error);
      alert("Error fetching data.");
    }
  };

  const handleShowAll = () => {
    fetchAllData();
    setShowAll(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assignments & Expenditures</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="personnelId"
          placeholder="Personnel ID"
          onChange={handleChange}
          value={formData.personnelId}
          required
        /><br /><br />

        <input
          type="text"
          name="assetType"
          placeholder="Asset Type"
          onChange={handleChange}
          value={formData.assetType}
          required
        /><br /><br />

        <input
          type="number"
          name="assignedQuantity"
          placeholder="Assigned Quantity"
          onChange={handleChange}
          value={formData.assignedQuantity}
        /><br /><br />

        <input
          type="number"
          name="expendedQuantity"
          placeholder="Expended Quantity"
          onChange={handleChange}
          value={formData.expendedQuantity}
        /><br /><br />

        <button type="submit">Assign / Mark Expended</button>
      </form>

      <br />
      <button onClick={handleShowAll}>Show All Records</button>

      {showAll && (
        <div style={{ marginTop: "30px" }}>
          <h3>All Assignments & Expenditures</h3>
          {allData.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Personnel ID</th>
                  <th>Asset Type</th>
                  <th>Assigned</th>
                  <th>Expended</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.personnelId}</td>
                    <td>{entry.assetType}</td>
                    <td>{entry.assignedQuantity}</td>
                    <td>{entry.expendedQuantity}</td>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Assignments;
