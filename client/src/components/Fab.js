import React from 'react';
const Fab = ({ icon, onClick, classes = '' }) => (
  <span
    className={`text-white p-2 rounded-full cursor-pointer hover:bg-transparent-black  ${classes}`}
    onClick={onClick}>
    {icon}
  </span>
);

export default Fab;
