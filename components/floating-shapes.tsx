import { memo } from 'react';

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#F0F2FF] to-white">
      <div className="shape-blob"></div>
      <div className="shape-blob one"></div>
      <div className="shape-blob two"></div>
      <div className="shape-blob three"></div>
      <div className="shape-blob four"></div>
      <div className="shape-blob five"></div>
      <div className="shape-blob six"></div>
    </div>
  );
};

export default memo(FloatingShapes);
