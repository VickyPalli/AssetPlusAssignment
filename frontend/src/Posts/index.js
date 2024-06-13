import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Typography,Container,Box ,Grid,TextField} from '@mui/material'
import axios from 'axios'
import React, { useState,useEffect } from 'react'
import ImageUploadModal from "../components/postPopup";

/**
 * The below components shows the working example of axios for API calls.
 * Also Material UI is integrated for design.
 */
function TestingAPI() {

    const [testData, setTestData] = React.useState(undefined);

    return (
        <Card style={{ width: "320px", margin: "20px", padding: "20px" }}>
            <CardHeader title="Test Component"></CardHeader>
            <CardContent>
                <Typography variant='body1'>Result: {testData ?? "(Click button below)"}</Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    onClick={async () => {
                        const response = await axios.get(`http://localhost:8000`);
                        setTestData(response.data);
                    }}>
                    Click to Test
                </Button>
            </CardActions>

            <CardActionArea>
                <Typography variant='caption'>You can make all the changes here -{'>'} <u><em>src/Posts/index.js</em></u> </Typography>
            </CardActionArea>

        </Card>


    )
}

export default function Posts() {
    // You can delete testingAPI component and start your assignment.    
    // return <TestingAPI />\
    const [images, setImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [allImages,setALlImages] = useState([])
    const [inputText,setInputText] = useState("")

    useEffect(() => {
        fetchImages();
      }, []);

      const seachHandler = (SearchText)=>{
        if(SearchText.length){
            const fileterData = images.filter((image)=>(image.title.toLowerCase().includes(SearchText.toLowerCase())))
            setImages(fileterData);
            setInputText(SearchText)
        }else{
            setInputText(SearchText)
            setImages(allImages)
        }
      }

      const fetchImages = async () => {
        try{
            const response = await axios.get('http://localhost:8000/post/images');
            setImages(response.data.data);
            setALlImages(response.data.data);
        }catch(err){
            console.log("Err in fetchImages",err)
        }
      };
    
      const handleOpen = () => setModalOpen(true);
      const handleClose = () => setModalOpen(false);
    return  <Container>
    <Typography variant="h2" gutterBottom>
      Image Upload
    </Typography>
    <Button variant="contained" color="primary" onClick={handleOpen}>
      Upload Image
    </Button>
    <ImageUploadModal open={modalOpen} handleClose={handleClose} refreshImages={fetchImages} />
    <TextField
            label="Seach"
            value={inputText}
            onChange={(e) => seachHandler(e.target.value)}
            fullWidth
            margin="normal"
          />
    <Box mt={4}>
      <Typography variant="h4" style={{marginBottom:"20px"}}>Images</Typography>
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item key={image._id} xs={12} sm={6} md={4}>
            <Typography variant="h6" style={{marginBottom:"10px"}}>{image.title}</Typography>
            <Typography variant="body2" style={{marginBottom:"10px"}}>{image.description}</Typography>
            <img src={image.imageData} alt={"image"} width="100%" />
            <Typography variant="body2" style={{marginBottom:"10px"}}>{image.description}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
}
