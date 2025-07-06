import { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import CameraCapture from './components/CameraCapture/CameraCapture';
import ImageEditor from './components/ImageEditor/ImageEditor';
import './App.css';

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          カメラ画像編集ツール
        </Typography>
        <Paper elevation={3} sx={{ p: 2, minHeight: { xs: '60vh', md: '70vh' }, display: 'flex', flexDirection: 'column' }}>
          {imageSrc === null ? (
            <CameraCapture onCapture={setImageSrc} />
          ) : (
            <ImageEditor imageSrc={imageSrc} onBack={() => setImageSrc(null)} />
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
