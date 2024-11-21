import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInstagram, FaYoutube, FaDownload, FaInfoCircle } from 'react-icons/fa';
// import Image from 'next/image';

const MediaDownload = () => {
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState('instagram');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleDownload = async () => {
        if (!url) {
            setError('Please add a URL');
            return;
        }

        setIsLoading(true);
        setError('');
        setPreview(null);

        try {
            // let cleanUrl = url.split('?')[0];
            const res = await fetch('https://mediasave.kryzetech.com/api/instagram.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postUrl: url }),
            });

            const data = await res.json();
            console.log('API Response:', data);

            if (!res.ok || data.error) {
                throw new Error(data.error || 'Failed to fetch media info');
            }

            if (data.platform === 'instagram') {
                if (data.type === 'carousel') {
                    setPreview({
                        platform: 'instagram',
                        type: 'carousel',
                        url: data.zipFilePath
                    });
                } else {
                    const proxyUrl = `https://mediasave.kryzetech.com/api/instagram.php?proxy_url=${encodeURIComponent(data.fileUrl)}`;
                    setPreview({
                        platform: 'instagram',
                        type: data.type,
                        url: proxyUrl,
                        fileType: data.fileType,
                        originalUrl: data.fileUrl,
                        thumbnail: data.fileUrl
                    });
                }
            } else if (data.platform === 'youtube') {
                const uniqueDownloadLinks = Array.from(new Set(data.data.downloadLinks.items.map(item => item.quality)))
                    .map(quality => {
                        return data.data.downloadLinks.items.find(item => item.quality === quality);
                    });
                setPreview({
                    platform: 'youtube',
                    type: 'video',
                    title: data.data.title,
                    thumbnail: data.data.thumbnail || '',
                    duration: data.data.duration,
                    downloadLinks: uniqueDownloadLinks || [],
                    url: uniqueDownloadLinks[0]?.url || '',
                });
            }
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message || 'Download failed');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadMedia = async (mediaUrl, fileType) => {
        try {
            const proxyUrl = `https://mediasave.kryzetech.com/api/instagram.php?proxy_url=${encodeURIComponent(mediaUrl)}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            if (blob.size === 0) {
                throw new Error('Downloaded file is empty');
            }

            const timestamp = new Date().getTime();
            const extension = fileType.toLowerCase().replace('video', 'mp4').replace('image', 'jpg');
            const fileName = `${platform}_${timestamp}.${extension}`;

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
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

    const handlePreviewDownload = async () => {
        if (!preview) return;
        try {
            if (preview.platform === 'youtube') {
                await downloadMedia(preview.url, preview.fileType);
            } else if (preview.type === 'carousel') {
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
                await downloadMedia(preview.originalUrl || preview.url, preview.fileType);
            }
        } catch (err) {
            setError('Download failed: ' + err.message);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light py-2">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                    <img src="/logo/medialogo.jpg" alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className={`nav-link ${platform === 'instagram' ? 'active' : ''}`} onClick={() => setPlatform('instagram')} href="#">Instagram</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${platform === 'youtube' ? 'active' : ''}`} onClick={() => setPlatform('youtube')} href="#">YouTube</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="row justify-content-center mt-3">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            {/* Platform specific content */}
                            <div className="text-center mb-4">
                                {platform === 'instagram' ? (
                                    <div>
                                        <FaInstagram className="text-primary mb-3" style={{ fontSize: '3rem' }} />
                                        <h2 className="h4 mb-3">Instagram Downloader</h2>
                                        <p className="text-muted">Download photos, videos, and reels from Instagram</p>
                                    </div>
                                ) : (
                                    <div>
                                        <FaYoutube className="text-danger mb-3" style={{ fontSize: '3rem' }} />
                                        <h2 className="h4 mb-3">YouTube Downloader</h2>
                                        <p className="text-muted">Download shorts and videos from YouTube</p>
                                    </div>
                                )}
                            </div>

                            {/* URL Input Section */}
                            <div className="mb-4">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder={`Paste ${platform} URL here...`}
                                        disabled={isLoading}
                                    />
                                    <button
                                        className={`btn btn-lg ${platform === 'instagram' ? 'btn-primary' : 'btn-danger'}`}
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

                            {/* Preview Section */}
                            {preview && (
                                <div className="preview-section mt-4 text-center">
                                    <div className="preview-container mb-3">
                                        {preview.type === 'video' ? (
                                            <div className="video-preview">
                                                {preview.platform === 'youtube' && preview.thumbnail ? (
                                                    <img
                                                        src={preview.thumbnail}
                                                        alt="Video thumbnail"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                                        width={400}
                                                        height={225}
                                                    />
                                                ) : (
                                                    <video
                                                        controls
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '400px', width: '100%' }}
                                                        preload="metadata"
                                                    >
                                                        <source src={preview.url} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
                                            </div>
                                        ) : preview.type === 'carousel' ? (
                                            <div className="carousel-preview p-3 bg-light rounded">
                                                <FaInstagram className="text-primary" style={{ fontSize: '3rem' }} />
                                                <p className="mt-2 mb-0">Multiple media files</p>
                                            </div>
                                        ) : preview.type === 'image' ? (
                                            <img
                                                src={preview.originalUrl}
                                                alt="Preview"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                                width={400}
                                                height={300}
                                            />
                                        ) : null}
                                    </div>

                                    {/* यूट्यूब के लिए टेबल */}
                                    {platform === 'youtube' && preview && (
                                        <div className="mt-4">
                                            <h3 className="h5">Video Quality Options</h3>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Quality</th>
                                                        <th>Download</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {preview.downloadLinks.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.quality}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => downloadMedia(item.url, item.mimeType)}
                                                                >
                                                                    Download
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {platform === 'instagram' && (
                                        <div className="mt-3">
                                            <button
                                                className={`btn btn-lg ${platform === 'instagram' ? 'btn-primary' : 'btn-danger'}`}
                                                onClick={handlePreviewDownload}
                                            >
                                                <FaDownload className="me-2" />
                                                Download {preview.type === 'carousel' ? 'All Media' : 'Media'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* How to use section */}
                            <div className="card bg-light border-0 mt-4">
                                <div className="card-body">
                                    <h5 className="card-title">How to use:</h5>
                                    <ol className="mb-0">
                                        <li className="mb-2">Copy the {platform} {platform === 'instagram' ? 'post/reel' : 'video/shorts'} URL</li>
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