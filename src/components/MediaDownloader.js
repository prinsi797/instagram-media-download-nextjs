import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInstagram, FaDownload, FaInfoCircle } from 'react-icons/fa';
import JSZip from 'jszip';

const MediaDownload = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const downloadMedia = async (mediaUrl, fileType, fileName) => {
        try {
            const response = await fetch(mediaUrl);
            if (!response.ok) throw new Error('Media download failed');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            
            link.download = fileName || `media.${fileType}`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            
            return true;
        } catch (error) {
            console.error('Download error:', error);
            return false;
        }
    };

    const downloadZip = async (mediaUrls) => {
        try {
            const zip = new JSZip();
            for (let i = 0; i < mediaUrls.length; i++) {
                const { url, type } = mediaUrls[i];
                const fileName = `media_${i + 1}.${type}`;
    
                console.log('Downloading from URL:', url);
    
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch media from ${url}, Status: ${response.status}`);
                    }
                    const blob = await response.blob();
    
                    // Check if the blob is valid
                    if (blob.size === 0) {
                        console.error(`Empty blob received for ${url}`);
                        continue;
                    }
    
                    zip.file(fileName, blob);
                    console.log(`Added file ${fileName} to ZIP`);
                } catch (error) {
                    console.error(`Error downloading file from ${url}:`, error);
                }
            }
    
            if (zip.files.length === 0) {
                console.error('No files added to the ZIP');
                return false;
            }
    
            const content = await zip.generateAsync({ type: 'blob' });
            const blobUrl = window.URL.createObjectURL(content);
    
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'instagram_media.zip';
    
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
    
            return true;
        } catch (error) {
            console.error('ZIP download error:', error);
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

            // Check if it's a single media URL or multiple
            if (data.mediaUrls && data.mediaUrls.length > 1) {
                // Download multiple images as a ZIP file
                await downloadZip(data.mediaUrls);
            } else if (data.fileUrl) {
                const fileName = `instagram_media.${data.fileType}`;
                const success = await downloadMedia(data.fileUrl, data.fileType, fileName);
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
