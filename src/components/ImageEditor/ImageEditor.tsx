import { Box, Button, Typography, Slider, FormControl, Grid, Paper, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useRef, useEffect, useState, useCallback } from 'react';

interface ImageEditorProps {
  imageSrc: string;
  onBack: () => void;
}

const ImageEditor = ({ imageSrc, onBack }: ImageEditorProps) => {
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [renderWidth, setRenderWidth] = useState(0);
  const [renderHeight, setRenderHeight] = useState(0);

  const [resolutionScale, setResolutionScale] = useState(100);
  const [minScale, setMinScale] = useState(1);
  const [dataSizeB, setDataSizeB] = useState('0');
  const [formattedDataSize, setFormattedDataSize] = useState('0 B');

  const [gradationMode, setGradationMode] = useState<'none' | 'grayscale' | 'rgb'>('none');
  const [gradationLevels, setGradationLevels] = useState(256);

  const applyGradation = useCallback((imageData: ImageData, mode: 'none' | 'grayscale' | 'rgb', levels: number): ImageData => {
    const data = imageData.data;
    const step = 256 / levels;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (mode === 'grayscale') {
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        const quantizedGray = Math.floor(gray / step) * step;
        data[i] = quantizedGray;
        data[i + 1] = quantizedGray;
        data[i + 2] = quantizedGray;
      } else if (mode === 'rgb') {
        data[i] = Math.floor(r / step) * step;
        data[i + 1] = Math.floor(g / step) * step;
        data[i + 2] = Math.floor(b / step) * step;
      }
    }
    return imageData;
  }, []);

  const drawImage = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const processingCanvas = processingCanvasRef.current;
    const image = imageRef.current;

    if (displayCanvas && processingCanvas && image && renderWidth > 0 && renderHeight > 0) {
      const displayCtx = displayCanvas.getContext('2d');
      const processingCtx = processingCanvas.getContext('2d');

      if (displayCtx && processingCtx) {
        processingCanvas.width = renderWidth;
        processingCanvas.height = renderHeight;
        processingCtx.drawImage(image, 0, 0, renderWidth, renderHeight);

        let imageData = processingCtx.getImageData(0, 0, renderWidth, renderHeight);
        imageData = applyGradation(imageData, gradationMode, gradationLevels);
        processingCtx.putImageData(imageData, 0, 0);

        displayCanvas.width = width;
        displayCanvas.height = height;

        displayCtx.imageSmoothingEnabled = false;
        // @ts-ignore: for browser compatibility
        displayCtx.mozImageSmoothingEnabled = false;
        // @ts-ignore: for browser compatibility
        displayCtx.webkitImageSmoothingEnabled = false;
        // @ts-ignore: for browser compatibility
        displayCtx.msImageSmoothingEnabled = false;

        displayCtx.drawImage(processingCanvas, 0, 0, width, height);
      }
    }
  }, [width, height, renderWidth, renderHeight, gradationMode, gradationLevels, applyGradation]);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      imageRef.current = image;
      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;

      setWidth(naturalWidth);
      setHeight(naturalHeight);
      setRenderWidth(naturalWidth);
      setRenderHeight(naturalHeight);

      const minDimension = Math.min(naturalWidth, naturalHeight);
      if (minDimension > 5) {
        setMinScale((5 / minDimension) * 100);
      }
      setResolutionScale(100);
    };
  }, [imageSrc]);

  useEffect(() => {
    if (width > 0 && height > 0) {
      const newRenderWidth = Math.max(1, Math.round(width * (resolutionScale / 100)));
      const newRenderHeight = Math.max(1, Math.round(height * (resolutionScale / 100)));
      setRenderWidth(newRenderWidth);
      setRenderHeight(newRenderHeight);
    }
  }, [resolutionScale, width, height]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  useEffect(() => {
    if (renderWidth > 0 && renderHeight > 0) {
      let bitsPerPixel = 0;
      if (gradationMode === 'rgb') {
        bitsPerPixel = Math.floor(Math.log2(gradationLevels)) * 3; // RGB各チャンネル
      } else if (gradationMode === 'grayscale') {
        bitsPerPixel = Math.floor(Math.log2(gradationLevels)); // グレースケール
      } else {
        bitsPerPixel = 24; // デフォルトは24ビット（RGB各8ビット）
      }

      const totalBits = renderWidth * renderHeight * bitsPerPixel;
      const bytes = totalBits / 8;

      setDataSizeB(bytes.toLocaleString(undefined, { maximumFractionDigits: 0 }));
      setFormattedDataSize(formatBytes(bytes));
    } else {
      setDataSizeB('0');
      setFormattedDataSize('0 B');
    }
  }, [renderWidth, renderHeight, gradationMode, gradationLevels]);

  const handleResetAll = () => {
    setGradationMode('none');
    setGradationLevels(256);
    setResolutionScale(100);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" textAlign="center">画像エディタ</Typography>
      <Box sx={{ flexGrow: 1, my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas ref={displayCanvasRef} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        <canvas ref={processingCanvasRef} style={{ display: 'none' }} />
      </Box>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={4}>
          {/* @ts-ignore */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>階調調整</Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup value={gradationMode} onChange={(e) => setGradationMode(e.target.value as 'none' | 'grayscale' | 'rgb')}>
                <FormControlLabel value="none" control={<Radio />} label="なし" />
                <FormControlLabel value="grayscale" control={<Radio />} label="グレースケール階調" />
                <FormControlLabel value="rgb" control={<Radio />} label="RGB各チャンネル階調" />
              </RadioGroup>
            </FormControl>

            {gradationMode !== 'none' && (
              <Box>
                <Typography gutterBottom>階調数: {gradationLevels}</Typography>
                <Slider
                  value={gradationLevels}
                  onChange={(_, v) => setGradationLevels(v as number)}
                  min={2}
                  max={256}
                  step={1}
                  aria-labelledby="gradation-levels-slider"
                />
              </Box>
            )}
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>解像度</Typography>
            <Slider value={resolutionScale} onChange={(_, v) => setResolutionScale(v as number)} min={minScale} max={100} step={0.1} aria-labelledby="resolution-slider" />
            <Typography variant="body2" textAlign="right">サイズ: {renderWidth}px × {renderHeight}px ({resolutionScale.toFixed(1)}%)</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
              <Typography variant="body2">理論データ量: </Typography>
              <Box sx={{ minWidth: '180px', textAlign: 'right' }}>
                <Typography variant="body2" component="span"><strong>{dataSizeB} B</strong> ({formattedDataSize})</Typography>
              </Box>
              <Typography variant="body2">(非圧縮時)</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 1}}>
              <Button fullWidth variant="contained" color="secondary" onClick={handleResetAll}>元に戻す</Button>
              <Button fullWidth variant="outlined" onClick={onBack}>撮り直す</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ImageEditor;
