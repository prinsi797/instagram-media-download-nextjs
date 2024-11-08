import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInstagram, FaDownload, FaInfoCircle } from 'react-icons/fa';

const MediaDownload = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);


    const downloadMedia = async (mediaUrl, fileType) => {
        try {
            console.log('Attempting to download from:', mediaUrl);

            const response = await fetch(mediaUrl, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://www.instagram.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                mode: 'cors', // CORS मोड जोड़ें
                credentials: 'omit' // क्रेडेंशियल्स को omit करें
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            console.log('Blob size:', blob.size);

            if (blob.size === 0) {
                throw new Error('Downloaded file is empty');
            }

            // Create a timestamp for unique filename
            const timestamp = new Date().getTime();
            const extension = fileType.toLowerCase().replace('video', 'mp4').replace('image', 'jpg');
            const fileName = `instagram_${timestamp}.${extension}`;
    
            // const fileName = `instagram_${timestamp}.${fileType}`;

            // Create download link
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            return true;
        } catch (error) {
            console.error('Download error:', error);
            throw new Error(`Download failed: ${error.message}`);
        }
    };

    const handleDownload = async () => {
        if (!url) {
            setError('Please add Instagram URL');
            return;
        }

        setIsLoading(true);
        setError('');
        setPreview(null); // Reset preview when starting new download

        try {
            let cleanUrl = url.split('?')[0];
            const postMatch = cleanUrl.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?/);

            if (!postMatch || !postMatch[2]) {
                throw new Error('Invalid Instagram URL format');
            }

            const res = await fetch('https://mediasave.kryzetech.com/api/instagram.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postUrl: cleanUrl }),
            });

            const data = await res.json();
            console.log('API Response:', data);

            if (!res.ok || data.error) {
                throw new Error(data.error || 'Failed to fetch media info');
            }

            // Set preview data
            if (data.zipFilePath) {
                setPreview({
                    type: 'carousel',
                    url: data.zipFilePath
                });
            } else if (data.fileUrl) {
                const isVideo = data.fileType === 'mp4' || data.fileUrl.includes('.mp4');
                setPreview({
                    type: isVideo ? 'video' : 'image',
                    url: data.fileUrl,
                    fileType: data.fileType
                });
            }

        } catch (err) {
            console.error('Error details:', err);
            setError(err.message || 'Download failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviewDownload = async () => {
        if (!preview) return;

        try {
            if (preview.type === 'carousel') {
                const zipResponse = await fetch(preview.url);
                if (!zipResponse.ok) {
                    throw new Error('ZIP download failed');
                }

                const zipBlob = await zipResponse.blob();
                const blobUrl = window.URL.createObjectURL(zipBlob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'instagram_media.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            } else {
                const fileExtension = preview.type === 'video' ? 'mp4' : 
                                preview.type === 'image' ? 'jpg' : 
                                preview.fileType;
            
            await downloadMedia(preview.url, fileExtension);
                // await downloadMedia(preview.url, preview.type);
            }
        } catch (err) {
            setError('Download failed: ' + err.message);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            {/* Existing header section */}
                            <div className="text-center mb-4">
                                <FaInstagram className="text-primary mb-3" style={{ fontSize: '3rem' }} />
                                <h1 className="h3 mb-3">Instagram Media Downloader</h1>
                                <p className="text-muted">
                                    Download photos and videos from Instagram
                                </p>
                            </div>

                            {/* URL input section */}
                            <div className="mb-4">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Paste Instagram URL here..."
                                        disabled={isLoading}
                                    />
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={handleDownload}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <FaDownload className="me-2" />
                                        )}
                                        Preview
                                    </button>
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        <FaInfoCircle className="me-2" />
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Preview section */}
                            {preview && (
                                <div className="preview-section mt-4 text-center">
                                    {/* <h5 className="mb-3">Media Preview</h5> */}
                                    <div className="preview-container mb-3">
                                        {preview.type === 'video' ? (
                                            <div className="video-preview">
                                                <video
                                                    controls
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '400px', width: '100%' }}
                                                    preload="metadata"
                                                >
                                                    <source src={preview.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        ) : preview.type === 'carousel' ? (
                                            <div className="carousel-preview p-3 bg-light rounded">
                                                <FaInstagram className="text-primary" style={{ fontSize: '3rem' }} />
                                                <p className="mt-2 mb-0">Multiple media files</p>
                                            </div>
                                        ) : (
                                            <img
                                                src={preview.url}
                                                alt="Preview"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '400px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        {/* <p className="text-muted mb-2">
                                            Type: {preview.type.charAt(0).toUpperCase() + preview.type.slice(1)}
                                        </p> */}
                                        <button
                                            className="btn btn-success btn-lg"
                                            onClick={handlePreviewDownload}
                                        >
                                            <FaDownload className="me-2" />
                                            Download {preview.type === 'carousel' ? 'All Media' : 'Media'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* How to use section */}
                            <div className="card bg-light border-0 mt-4">
                                <div className="card-body">
                                    <h5 className="card-title">How to use:</h5>
                                    <ol className="mb-0">
                                        <li className="mb-2">Copy the URL of any Instagram post/reel</li>
                                        <li className="mb-2">Paste the URL above</li>
                                        <li className="mb-2">Click Preview to see the media</li>
                                        <li>Click Download to save the media</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaDownload;