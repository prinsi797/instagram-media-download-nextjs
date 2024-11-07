import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInstagram, FaDownload, FaInfoCircle } from 'react-icons/fa';

const MediaDownload = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const downloadMedia = async (mediaUrl, fileType) => {
        try {
            const response = await fetch(mediaUrl);
            if (!response.ok) throw new Error('Media download failed');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            
            link.download = `instagram_media.${fileType}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            
            return true;
        } catch (error) {
            console.error('Download error:', error);
            return false;
        }
    };

    const handleDownload = async () => {
        if (!url) {
            setError('Please add Instagram URL');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const cleanUrl = url.split('?')[0];
            console.log('Fetching:', cleanUrl);

            // API call to fetch media info
            const res = await fetch('https://mediasave.kryzetech.com/api/instagram.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postUrl: cleanUrl }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch media info');
            }

            const data = await res.json();
            console.log('API Response:', data);

            if (data.zipFilePath) {
                const zipResponse = await fetch(data.zipFilePath);
                const zipBlob = await zipResponse.blob();
    
                const blobUrl = window.URL.createObjectURL(zipBlob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'instagram_media.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);

            } else if (data.fileUrl) {
                const success = await downloadMedia(data.fileUrl, data.fileType);
                if (!success) {
                    throw new Error('Failed to download media');
                }
            } else {
                throw new Error('No valid media found');
            }
    
        } catch (err) {
            console.error('Error details:', err);
            setError(`Download failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <FaInstagram className="text-primary mb-3" style={{ fontSize: '3rem' }} />
                                <h1 className="h3 mb-3">Instagram Media Downloader</h1>
                                <p className="text-muted">
                                    Download photos and videos from Instagram
                                </p>
                            </div>

                            {/* Input and Button */}
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
                                        Download
                                    </button>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        <FaInfoCircle className="me-2" />
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Instructions */}
                            <div className="card bg-light border-0">
                                <div className="card-body">
                                    <h5 className="card-title">How to use:</h5>
                                    <ol className="mb-0">
                                        <li className="mb-2">Copy the URL of any Instagram post/reel</li>
                                        <li className="mb-2">Paste the URL above</li>
                                        <li className="mb-2">Click Download</li>
                                        <li>Save your media file</li>
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