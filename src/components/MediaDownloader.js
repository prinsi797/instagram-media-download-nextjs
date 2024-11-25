import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInstagram, FaYoutube, FaDownload, FaInfoCircle, FaSnapchat } from 'react-icons/fa';

const MediaDownload = () => {
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState('instagram');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [downloadingIndex, setDownloadingIndex] = useState(null);

    const handleDownload = async () => {
        if (!url) {
            setError('Please add a URL');
            return;
        }

        setIsLoading(true);
        setError('');
        setPreview(null);

        try {
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
            } else if (data.platform === 'snapchat') {
                if (data.success && data.data) {
                    setPreview({
                        platform: 'snapchat',
                        type: 'video',
                        title: data.data.title || 'Snapchat Video',
                        thumbnail: data.data.thumbnail,
                        url: data.data.videoDownloadUrl,
                        originalUrl: data.data.videoDownloadUrl,
                        fileType: 'video'
                    });
                } else {
                    throw new Error('Invalid Snapchat response format');
                }
            }
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message || 'Download failed');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadMedia = async (mediaUrl, fileType, index = null) => {
        try {
            setDownloadingIndex(index);
            setIsLoading(true);

            // const proxyUrl = `https://mediasave.kryzetech.com/api/instagram.php?proxy_url=${encodeURIComponent(mediaUrl)}`;
            const finalUrl = platform === 'snapchat' ? mediaUrl :
                `https://mediasave.kryzetech.com/api/instagram.php?proxy_url=${encodeURIComponent(mediaUrl)}`;

            const response = await fetch(finalUrl);
            // const response = await fetch(proxyUrl);

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
        } finally {
            setDownloadingIndex(null);
            setIsLoading(false);
        }
    };

    const handlePreviewDownload = async () => {
        if (!preview) return;
        try {
            if (preview.platform === 'youtube') {
                const videoUrl = preview.downloadLinks[0]?.url;
                if (videoUrl) {
                    window.open(videoUrl, '_blank');
                } else {
                    throw new Error('No download URL found');
                }
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

    const getPlatformColor = () => {
        switch (platform) {
            case 'instagram':
                return 'btn-primary';
            case 'youtube':
                return 'btn-danger';
            case 'snapchat':
                return 'btn-warning';
            default:
                return 'btn-primary';
        }
    };

    const getPlatformIcon = () => {
        switch (platform) {
            case 'instagram':
                return <FaInstagram className="text-primary mb-3" style={{ fontSize: '3rem' }} />;
            case 'youtube':
                return <FaYoutube className="text-danger mb-3" style={{ fontSize: '3rem' }} />;
            case 'snapchat':
                return <FaSnapchat className="text-warning mb-3" style={{ fontSize: '3rem' }} />;
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light py-2">
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="/logo/medialogo.jpg" alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
                            <li className="nav-item">
                                <a className={`nav-link ${platform === 'snapchat' ? 'active' : ''}`} onClick={() => setPlatform('snapchat')} href="#">Snapchat</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="row justify-content-center mt-3">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                {getPlatformIcon()}
                                <h2 className="h4 mb-3">{platform.charAt(0).toUpperCase() + platform.slice(1)} Downloader</h2>
                                <p className="text-muted">
                                    {platform === 'snapchat'
                                        ? 'Download stories and snaps from Snapchat'
                                        : platform === 'instagram'
                                            ? 'Download photos, videos, and reels from Instagram'
                                            : 'Download shorts and videos from YouTube'}
                                </p>
                            </div>

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
                                        className={`btn btn-lg ${getPlatformColor()}`}
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

                            {preview && (
                                <div className="preview-section mt-4 text-center">
                                    <div className="preview-container mb-3">
                                        {preview.type === 'video' && (
                                            <div className="video-preview">
                                                <video
                                                    controls
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '400px', width: '100%' }}
                                                    preload="metadata"
                                                    poster={preview.thumbnail}
                                                >
                                                    <source src={preview.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                {preview.platform === 'snapchat' && preview.title && (
                                                    <div className="mt-3">
                                                        <h5>{preview.title}</h5>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {preview.type === 'carousel' && (
                                            <div className="carousel-preview p-3 bg-light rounded">
                                                <FaInstagram className="text-primary" style={{ fontSize: '3rem' }} />
                                                <p className="mt-2 mb-0">Multiple media files</p>
                                            </div>
                                        )}

                                        {preview.type === 'image' && (
                                            <img
                                                src={preview.url}
                                                alt="Preview"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                                width={400}
                                                height={300}
                                            />
                                        )}
                                    </div>

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
                                                                    onClick={() => downloadMedia(item.url, item.mimeType, index)}
                                                                    disabled={downloadingIndex === index || isLoading}
                                                                >
                                                                    {downloadingIndex === index ? (
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    ) : (
                                                                        'Download'
                                                                    )}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {(platform === 'instagram' || platform === 'snapchat') && (
                                        <div className="mt-3">
                                            <button
                                                className={`btn btn-lg ${getPlatformColor()}`}
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