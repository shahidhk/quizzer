import React, { useEffect, useRef } from "react";

const CertificateAdmin = () => {
  let ref = useRef();
  let aref = useRef();
  let tref = useRef();

  const generateCertificate = () => {
    const name = tref.current.value;
    aref.current.innerHTML = 'Generating Certificate...';
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

      aref.current.href = canvas.toDataURL("image/jpeg");
      aref.current.download = `Summerise Certificate ${name}.jpg`;
      aref.current.innerHTML = 'Download Certificate';
    };
    img.src = '/summerise_certificate.jpg';
  };

  return (
    <div>
      <input ref={tref} type="text" name="name" onChange={generateCertificate}></input><br /><br />
      <a href="#" ref={aref} className="btn btn-success">Certificate</a> <br/> <br/>
      <canvas ref={ref} className="responsive"/>
    </div>
  );
};

export default CertificateAdmin;
