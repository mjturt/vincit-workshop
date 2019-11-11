import React, { useState } from "react";
import "./App.css";
import Webcam from "react-webcam";

const Logos = ({ logos }) => {
  return (
    <ul>
      {logos.map(item => {
        return <li key={item.description}>{item.description}</li>;
      })}
    </ul>
  );
};

const Labels = ({ labels }) => {
  return (
    <ul>
      {labels.map(item => {
        return <li key={item.description}>{item.description}</li>;
      })}
    </ul>
  );
};

const Faces = ({ faces }) => {
  return (
    <ul>
      {faces.map(face => {
        return (
          <>
            <li
              key={`Joy: ${face.joyLikelihood}`}
            >{`Joy: ${face.joyLikelihood}`}</li>
            <li
              key={`Anger: ${face.angerLikelihood}`}
            >{`Anger: ${face.angerLikelihood}`}</li>
            <li
              key={`Sorrow: ${face.sorrowLikelihood}`}
            >{`Sorrow: ${face.sorrowLikelihood}`}</li>
            <li
              key={`Surprise: ${face.surpriseLikelihood}`}
            >{`Surprise: ${face.surpriseLikelihood}`}</li>
          </>
        );
      })}
    </ul>
  );
};

const WebcamComponent = ({ onLabelsFetch, onFacesFetch, onLogosFetch }) => {
  const videoConstraints = {
    facingMode: "user",
    width: 512,
    height: 512
  };
  const webcamRef = React.createRef();

  const capture = onFetch => () => {
    const img = webcamRef.current.getScreenshot();
    onFetch(img);
  };

  return (
    <>
      <Webcam
        audio={false}
        videoConstraints={videoConstraints}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button id="btn-labels" onClick={capture(onLabelsFetch)}>Fetch labels</button>
      <button id="btn-faces" onClick={capture(onFacesFetch)}>Can you work?</button>
      <button id="btn-logos" onClick={capture(onLogosFetch)}>Fetch logos</button>
    </>
  );
};

const postScreenshot = async (img, api) => {
  const response = await fetch(api, {
    method: "POST",
    body: JSON.stringify({ image: img }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
  return response;
};

function App() {
  const [labels, setLabels] = useState([]);
  const [faces, setFaces] = useState([]);
  const [logos, setLogos] = useState([]);
  const updateLabels = async img => {
    const response = await postScreenshot(img, "/labels");
    setLabels(response.labels);
  };
  const updateFaces = async img => {
    const response = await postScreenshot(img, "/faces");
    setFaces(response.faces);
  };
  const updateLogos = async img => {
    const response = await postScreenshot(img, "/logos");
    setLogos(response.logos);
  };
  return (
    <div className="App">
      <WebcamComponent
        onLabelsFetch={updateLabels}
        onFacesFetch={updateFaces}
        onLogosFetch={updateLogos}
      />
      <Labels labels={labels} />
      <Faces faces={faces} />
      <Logos logos={logos} />
    </div>
  );
}

export default App;
