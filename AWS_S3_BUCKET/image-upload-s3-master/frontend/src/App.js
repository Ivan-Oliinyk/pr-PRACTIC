import { useState } from "react";
import axios from "axios";

import "./App.css";

async function postImage({ image, description }) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("description", description);

  const result = await axios.post("/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
}

function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const submit = async (event) => {
    event.preventDefault();
    const result = await postImage({ image: file, description });
    setImages([result.image, ...images]);
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Submit</button>
      </form>
      {images.map((image) => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}

      <img src="https://api-server-categories.s3.eu-central-1.amazonaws.com/c07d2403f3bf066c68bae8510bb8ab06.png"></img>
      {/* <img src="/images/2f0c2c5860cc6b5ac1a254b0d224c0cd"></img> */}
      <img src="https://api-server-categories.s3.eu-central-1.amazonaws.com/9ba36e0795efd3f7dbb3a2402d5dc0a0"></img>
      {/* <img src="https://my-new-test-s3-bucket.s3.amazonaws.com/mobile-cicle.png"></img> */}
    </div>
  );
}

export default App;
