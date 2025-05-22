import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    date: "",
    base: "All",
    assetType: "All",
  });

  const [data, setData] = useState({
    openingBalance: 0,
    closingBalance: 0,
    netMovement: 0,
    assigned: 0,
    expended: 0,
    purchases: [],
    transferIn: [],
    transferOut: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNetDetails, setShowNetDetails] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("https://ak-47-1.onrender.com/api/dashboard", {
          params: filters,
        });

        // assuming backend returns purchases, transferIn, transferOut arrays along with summary numbers
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Date:{" "}
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </label>{" "}
        &nbsp;&nbsp;
        <label>
          Base:{" "}
          <select name="base" value={filters.base} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Base A">Base A</option>
            <option value="Base B">Base B</option>
            {/* Add more bases */}
          </select>
        </label>{" "}
        &nbsp;&nbsp;
        <label>
          Equipment Type:{" "}
          <select
            name="assetType"
            value={filters.assetType}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="Rifle">Rifle</option>
            <option value="Vehicle">Vehicle</option>
            <option value="AK 47">AK 47</option>
            {/* Add more equipment types */}
          </select>
        </label>
      </div>

      {loading && <p>Loading dashboard data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div>
          <p>
            <strong>Opening Balance:</strong> {data.openingBalance}
          </p>
          <p>
            <strong>Closing Balance:</strong> {data.closingBalance}
          </p>
          <p>
            <strong
              style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setShowNetDetails(true)}
              title="Click to view details"
            >
              Net Movement: {data.netMovement}
            </strong>
          </p>
          <p>
            <strong>Assigned:</strong> {data.assigned}
          </p>
          <p>
            <strong>Expended:</strong> {data.expended}
          </p>
        </div>
      )}

      {/* Net Movement Details Popup */}
      {showNetDetails && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowNetDetails(false)} // close when clicking outside content
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "300px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h3>Net Movement Details</h3>

            <section>
              <h4>Purchases</h4>
              {data.purchases && data.purchases.length > 0 ? (
                <ul>
                  {data.purchases.map((p, i) => (
                    <li key={i}>
                      Date: {new Date(p.date).toLocaleDateString()}, Asset: {p.assetType}, Qty: {p.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No purchases found.</p>
              )}
            </section>

            <section>
              <h4>Transfer In</h4>
              {data.transferIn && data.transferIn.length > 0 ? (
                <ul>
                  {data.transferIn.map((t, i) => (
                    <li key={i}>
                      Date: {new Date(t.date).toLocaleDateString()}, Asset: {t.assetType}, Qty: {t.quantity}, From: {t.fromBase}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No transfer in records.</p>
              )}
            </section>

            <section>
              <h4>Transfer Out</h4>
              {data.transferOut && data.transferOut.length > 0 ? (
                <ul>
                  {data.transferOut.map((t, i) => (
                    <li key={i}>
                      Date: {new Date(t.date).toLocaleDateString()}, Asset: {t.assetType}, Qty: {t.quantity}, To: {t.toBase}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No transfer out records.</p>
              )}
            </section>

            <button onClick={() => setShowNetDetails(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
