import React, { useEffect, useState } from 'react';
import './style.css'; // Import the CSS file

const TimePicker = ({ value, setValue }) => {
  const [time, setTime] = useState(value ? value : "");

  const handleTimeChange = (e) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    let formattedValue = '';

    for (let i = 0; i < Math.min(inputValue.length, 6); i += 2) {
      formattedValue += inputValue.substring(i, i + 2) + ':';
    }

    const splittedTime = formattedValue.split(":");

    formattedValue = formattedValue.slice(0, -1);
    if (
      parseInt(splittedTime[0]) > 4 ||
      parseInt(splittedTime[1]) > 60 ||
      parseInt(splittedTime[2]) > 60
    ) {
      alert("Enter Number less than it");
    } else {
      setTime(formattedValue);
    }
  };
  useEffect(() => {
    setValue(`${time}`);
  }, [time]);

  return (
    <div className="time-picker-container">
      <label>
        Time:
        <input
          className="time-input"
          type="text"
          name="hours"
          value={time}
          onChange={handleTimeChange}
          lang="en"
        />
      </label>
    </div>
  );
};

export default TimePicker;
