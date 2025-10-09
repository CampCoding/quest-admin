import React, { useEffect, useState } from 'react';
import './TagsInput.css';

const TagsInput = ({ onSubmit, setTagifies, tagifies }) => {
  const [tags, setTags] = useState(tagifies);
  const [inputValue, setInputValue] = useState('');
  const suggestions = ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const trimmedValue = inputValue.trim();
      if (!tags.includes(trimmedValue)) {
        setTags([...tags, trimmedValue]);
      }
      setInputValue('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSuggestionClick = (suggestion) => {
    if (!tags.includes(suggestion)) {
      setTags([...tags, suggestion]);
    }
    setInputValue('');
  };

  const handleSubmit = () => {
    const distinctTags = Array.from(
      new Set(tags.filter((tag) => tag.trim() !== ''))
    );
    if (onSubmit && distinctTags.length > 0) {
      onSubmit(distinctTags);
      setTags([]);
    }
  };

  useEffect(() => {
    setTagifies(tags);
  }, [tags]);

  return (
    <div className="tags-input-container">
      <div className="tags-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button
              type="button"
              onClick={() => handleTagDelete(tag)}
              className="tag-delete-button"
            >
              x
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="keyword"
        className="tag-input"
      />
    </div>
  );
};

export default TagsInput;
