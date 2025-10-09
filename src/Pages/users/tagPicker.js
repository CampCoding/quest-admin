import React from 'react';
import "./style.css";
const TagPicker = ({ options, onSelect, numberedObject }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState(
    numberedObject ? numberedObject : {}
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleTagClick = (permissionId, valueId) => {
    const isSelected = selectedOptions[permissionId]?.includes(valueId);

    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = { ...prevSelectedOptions };

      if (isSelected) {
        // If the option is already selected, remove it
        updatedOptions[permissionId] = updatedOptions[permissionId].filter(
          (id) => id !== valueId
        );
      } else {
        // If the option is not selected, add it
        updatedOptions[permissionId] = [
          ...(updatedOptions[permissionId] || []),
          valueId,
        ];
      }

      // Pass the selected options to the parent component
      onSelect(updatedOptions);
      return updatedOptions;
    });
  };

  return (
    <div className={`custom-dropdown ${isOpen ? 'open' : ''}`}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        Select Permissions
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map((permission) => (
            <div key={permission.id}>
              <h4>{permission.label}</h4>
              {permission.values.map((value) => (
                <span
                  key={value.id}
                  onClick={() => handleTagClick(permission.id, value.id)}
                  className={
                    selectedOptions[permission.id]?.includes(value.id)
                      ? 'selected'
                      : ''
                  }
                >
                  {value.value}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagPicker;
