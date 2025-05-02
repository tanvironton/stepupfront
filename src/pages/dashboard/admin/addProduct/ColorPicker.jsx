/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { SketchPicker } from "react-color";

function ColorPicker({ onOpen, open, onChange, color }) {
  const handleOutsideClose = (event) => {
    if (event.target === event.currentTarget) {
      onOpen();
    }
  };

  return (
    <div onClick={handleOutsideClose}>
      {open ? (
        <SketchPicker disableAlpha={true} color={color} onChange={onChange} />
      ) : null}
    </div>
  );
}

export default ColorPicker;
