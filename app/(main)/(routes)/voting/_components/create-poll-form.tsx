// CreatePollForm.jsx

import React, { useState } from 'react'

const CreatePollForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
  })

  // Handler for input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  // Handler for adding new option field
  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] })
  }

  // Handler for removing option field
  const handleRemoveOption = (index) => {
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    setFormData({ ...formData, options: newOptions })
  }

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit form data to backend (will be implemented later)
    console.log(formData)
    // Reset form fields
    setFormData({ question: '', options: ['', ''] })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="question">Question:</label>
      <input
        type="text"
        id="question"
        name="question"
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
      />
      {formData.options.map((option, index) => (
        <div key={index}>
          <label htmlFor={`option-${index}`}>Option {index + 1}:</label>
          <input
            type="text"
            id={`option-${index}`}
            name={`option-${index}`}
            value={option}
            onChange={(e) => handleInputChange(e, index)}
          />
          {/* Show remove option button for all options except the first two */}
          {index > 1 && (
            <button type="button" onClick={() => handleRemoveOption(index)}>
              Remove Option
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddOption}>
        Add Option
      </button>
      <button type="submit">Create Poll</button>
    </form>
  )
}

export default CreatePollForm
