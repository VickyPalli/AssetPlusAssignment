import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Input = styled('input')({
  display: 'none',
});

const ImageUploadModal = ({ open, handleClose, refreshImages }) => {
    const [formData,setFormData] = useState({
        file :  null,
        title : "",
        description : "",
        preview : ""
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({...formData,preview:reader.result,file})
          };
          reader.readAsDataURL(file);
        }
      };

  const handleSubmit = async (e) => {
    try{
        e.preventDefault();
        const apiFormData = new FormData();
        apiFormData.append('image', formData.file);
        apiFormData.append('title', formData.title);
        apiFormData.append('description', formData.description);
    
        await axios.post('http://localhost:8000/post/upload', apiFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFormData({file:null,preview:"",title:"",description:""})
        refreshImages();
        handleClose();
    }catch(err){
        console.log("Err in handleSubmit",err)
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Upload Image
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData,title:e.target.value})}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData,description:e.target.value})}
            fullWidth
            margin="normal"
          />
          <label htmlFor="upload-button">
            <Input
              accept="image/*"
              id="upload-button"
              type="file"
              onChange={handleFileChange}
            />
            <Button variant="contained" component="span">
              Choose File
            </Button>
          </label>
          {formData.file && <TextField value={formData.file.name} fullWidth margin="normal" disabled />}
          {formData.preview && <img src={formData.preview} alt="Selected" style={{ width: '100%', marginTop: '16px' }} />}
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
            Upload
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ImageUploadModal;
