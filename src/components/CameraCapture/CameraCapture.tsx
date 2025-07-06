import { Box, Button, Typography } from '@mui/material';
import { useRef, useEffect, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("カメラの起動に失敗しました:", err);
      // エラーハンドリングをここに記述（例: アラート表示）
    }
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      // コンポーネントのアンマウント時にカメラを停止
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Canvasのサイズをビデオのサイズに合わせる
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Canvasにビデオの現在のフレームを描画
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // Canvasから画像データ（Data URL）を取得
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6">カメラプレビュー</Typography>
      <Box sx={{ flexGrow: 1, my: 2, position: 'relative' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>
      <Button variant="contained" size="large" onClick={handleCapture}>
        撮影
      </Button>
      {/* 描画用の非表示Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default CameraCapture;