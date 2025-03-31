import React, { useState } from "react";
import "./SubsidyApplication.css";
import axios from "axios";

const SubsidyApplication = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("document", document);

    try {
      await axios.post("/apply-subsidy", formData);
      alert("Application submitted!");
    } catch (error) {
      console.error("Error submitting subsidy application:", error);
    }
  };

  return (
    <div>
      <h2>Apply for Government Subsidy</h2>
      <form onSubmit={handleApply}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setDocument(e.target.files[0])} required />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default SubsidyApplication;
