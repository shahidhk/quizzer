import React, { useEffect, useRef } from "react";

const Certificate = ({ name }) => {
  let ref = useRef();
  let aref = useRef();

  useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext('2d');
    var img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      context.fillStyle = "black";
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.font = '35pt Arizonia';
      context.fillText(name, canvas.width * 0.5, canvas.height * 0.48);

      aref.current.href = canvas.toDataURL();
      aref.current.download = `Summerise Certificate ${name}.jpg`;
      aref.current.innerHTML = 'Download Certificate';
    };
    img.src = '/summerise_certificate.jpg';
  });

  return (
    <div>
      <canvas ref={ref} style={{display: 'none'}}/>
      <a href="#" ref={aref} className="btn btn-success">Loading Certificate...</a>
    </div>
  );
};

export default Certificate;
