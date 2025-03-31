import React, { useState, useEffect } from "react";
import axios from "axios";

const CompetitionList = () => {
  const [competitions, setCompetitions] = useState([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/competitions");
      const data = response.data;

      // Extract unique tags
      const allTags = Array.from(new Set(data.map((comp) => comp.category)));
      setTags(allTags);
      setCompetitions(data);
      setFilteredCompetitions(data); // Show all by default
    } catch (error) {
      console.error("Error fetching competitions:", error);
    }
  };

  // Handle tag change and filter competitions
  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);

    if (tag === "") {
      setFilteredCompetitions(competitions); // Show all if no tag selected
    } else {
      const filtered = competitions.filter((comp) => comp.category === tag);
      setFilteredCompetitions(filtered);
    }
  };

  return (
    <div>
      <h1>Kaggle Competitions</h1>

      {/* Dropdown for Tag Filtering */}
      <select value={selectedTag} onChange={handleTagChange}>
        <option value="">All Tags</option>
        {tags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      {/* Display Filtered Competitions */}
      {filteredCompetitions.length === 0 ? (
        <p>No competitions found...</p>
      ) : (
        <ul>
          {filteredCompetitions.map((comp, index) => (
            <li key={index}>
              <a href={comp.ref} target="_blank" rel="noopener noreferrer">
                {comp.title}
              </a>{" "}
              <br />
              💰 <strong>Reward:</strong> {comp.reward} | 📚{" "}
              <strong>Category:</strong> {comp.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompetitionList;
