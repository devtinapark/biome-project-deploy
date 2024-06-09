import React, { useState, useEffect } from 'react';

const NFTBox = () => {
  const [projectApply, setProjectApply] = useState({
    title: '',
    location: '',
    goal: '',
    desc: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setSuccessMessage('');
    const { name, value } = e.target;
    setProjectApply((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmSend = () => {
    // Save to local storage
    localStorage.setItem('projectApplication', JSON.stringify(projectApply));

    // Console log data
    console.log('Project Application:', projectApply);

    // Display success message
    setSuccessMessage('Application submitted successfully!');

    // Clear form
    setProjectApply({
      title: '',
      location: '',
      goal: '',
      desc: ''
    });
  };

  return (
    <div className="project-box mx-auto p-6 rounded-lg">
      <h1 className="text-2xl mb-6">Apply to List Project</h1>
      <div className="mb-4">
        <p className="font-bold">Project Title</p>
        <input
          type="text"
          name="title"
          className="w-full p-2 mt-2 border border-primary rounded-lg bg-transparent"
          placeholder="Enter project title"
          value={projectApply.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <p className="font-bold">Project Location</p>
        <input
          type="text"
          name="location"
          className="w-full p-2 mt-2 border border-primary rounded-lg bg-transparent"
          placeholder="Enter project location"
          value={projectApply.location}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <p className="font-bold">Donation Goal in BIOME</p>
        <input
          type="number"
          name="goal"
          className="w-full p-2 mt-2 border border-primary rounded-lg bg-transparent"
          placeholder="Enter donation goal"
          value={projectApply.goal}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <p className="font-bold">Description</p>
        <input
          name="desc"
          className="w-full p-2 mt-2 border border-primary rounded-lg bg-transparent"
          rows="4"
          placeholder="Enter project description"
          value={projectApply.desc}
          onChange={handleChange}
        ></input>
        <textarea
          name="desc"
          className="w-full p-2 mt-2 border border-primary rounded-lg bg-transparent"
          rows="4"
          placeholder="Enter project description"
          value={projectApply.desc}
          onChange={handleChange}
        ></textarea>
      </div>
      <button
        onClick={handleConfirmSend}
        className="mt-6 flex flex-row items-center justify-around w-full bg-white bg-opacity-20 rounded-lg shadow-md backdrop-filter backdrop-blur-md border border-white border-opacity-30 p-4"
        style={{
          background: 'linear-gradient(#05FFE6, #510CA7)',
        }}>
        Submit Application
      </button>
      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default NFTBox;
