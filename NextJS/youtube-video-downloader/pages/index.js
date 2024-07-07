// pages/index.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

export default function Home() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [progress, setProgress] = useState('');

  useEffect(() => {
    const socket = io();

    socket.on('progress', data => {
      setProgress(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDownload = async () => {
    setMessage('');
    setDownloadLink('');
    setProgress('');
    try {
      const response = await axios.post('/api/download', { url });
      setMessage(response.data.message);
      setDownloadLink(response.data.file);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Download failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">YouTube Video Downloader</h1>
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded w-full mb-4 text-black" // Ensure text color is black
        />
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Download
        </button>
        {message && <p className="mt-4 text-center text-black">{message}</p>} {/* Update text color */}
        {progress && <p className="mt-4 text-center text-black">{progress}</p>} {/* Update text color */}
        {downloadLink && (
          <div className="mt-4 text-center">
            <a
              href={downloadLink}
              download
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
