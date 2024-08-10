'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import classes from './image-picker.module.css';
export default function ImagePicker({ label, name }) {
  const imageInput = useRef();
  const [imagePicked, setImagePicked] = useState();
  function handleClick() {
    imageInput.current.click();
  }
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) {
      setImagePicked(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImagePicked(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }
  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {imagePicked && <Image src={imagePicked} alt="Picked" fill />}
          {!imagePicked && <p>No image picked yet.</p>}
        </div>
        <input
          type="file"
          id={name}
          name={name}
          accept="image/jpeg, image/png"
          className={classes.input}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <button type="button" className={classes.button} onClick={handleClick}>
          Pick an Image
        </button>
      </div>
    </div>
  );
}
