// LoreBoard.jsx
import React, { useState } from "react";
import { loreCategories } from "../sampleLoreData";
import "./LoreBoard.css"; // Optional, for styling

function LoreBoard() {
  console.log("✅ LoreBoard component has rendered.");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedEntries, setExpandedEntries] = useState({});

  // Toggle full lore entry visibility
  const toggleEntry = (title) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="loreboard-container">
      {/* Sidebar: Category List */}
      <div className="loreboard-sidebar">
        <h3>📚 Lore Categories</h3>
        <ul>
          {Object.keys(loreCategories).map((category) => (
            <li
              key={category}
              className={category === selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Panel: Lore Entries */}
      <div className="loreboard-content">
        <h2>{selectedCategory || "Select a Category"}</h2>
        {selectedCategory &&
          loreCategories[selectedCategory].map((entry) => (
            <div key={entry.title} className="lore-entry-card">
              <h4>{entry.title}</h4>
              <p>
                {expandedEntries[entry.title]
                  ? entry.content
                  : `${entry.content.slice(0, 80)}...`}
              </p>
              <button onClick={() => toggleEntry(entry.title)}>
                {expandedEntries[entry.title] ? "Hide" : "Read More"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default LoreBoard;
