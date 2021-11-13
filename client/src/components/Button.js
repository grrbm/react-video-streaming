import React from 'react';
const Button = ({ children, Prop, classes = '', color = 'blue' }) => (
  <button
    className={`px-4 py-2 bg-${color}-500 text-white font-sans hover:bg-${color}-600 rounded focus:shadow-outline ${classes}`}
    {...Prop}>
    {children}
  </button>
);

export default Button;
