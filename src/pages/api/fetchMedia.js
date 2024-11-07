import archiver from 'archiver';
import path from 'path';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import querystring from 'querystring';

const downloadsDir = path.join(process.cwd(), 'downloads');

const encodePostRequestData = (shortcode) => {
    const requestData = {
        // Your request data
        av: "0",
        __d: "www",
        __user: "0",
        __a: "1",
        __req: "3",
        __hs: "19624.HYP:instagram_web_pkg.2.1..0.0",
        dpr: "3",
        __ccg: "UNKNOWN",
        __rev: "1008824440",
        __s: "xf44ne:zhh75g:xr51e7",
        __hsi: "7282217488877343271",
        __dyn: "7xeUmwlEnwn8K2WnFw9-2i5U4e0yoW3q32360CEbo1nEhw2nVE4W0om78b87C0yE5ufz81s8hwGwQwoEcE7O2l0Fwqo31w9a9x-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7-0iK2S3qazo7u1xwIw8O321LwTwKG1pg661pwr86C1mwraCg",
        __csr: "gZ3yFmJkillQvV6ybimnG8AmhqujGbLADgjyEOWz49z9XDlAXBJpC7Wy-vQTSvUGWGh5u8KibG44dBiigrgjDxGjU0150Q0848azk48N09C02IR0go4SaR70r8owyg9pU0V23hwiA0LQczA48S0f-x-27o05NG0fkw",
        __comet_req: "7",
        lsd: "AVqbxe3J_YA",
        jazoest: "2957",
        __spin_r: "1008824440",
        __spin_b: "trunk",
        __spin_t: "1695523385",
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
        variables: JSON.stringify({
            shortcode: shortcode,
            fetch_comment_count: "null",
            fetch_related_profile_media_count: "null",
            parent_comment_count: "null",
            child_comment_count: "null",
            fetch_like_count: "null",
            fetch_tagged_user_count: "null",
            fetch_preview_comment_count: "null",
            has_threaded_comments: "false",
            hoisted_comment_id: "null",
            hoisted_reply_id: "null",
        }),
        server_timestamps: "true",
        doc_id: "10015901848480474",
    };
    return querystring.stringify(requestData);
};

const fetchFromGraphQL = async (postId) => {
    const API_URL = "https://www.instagram.com/api/graphql";
    const headers = {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
        "X-CSRFToken": "RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52",
        "X-IG-App-ID": "1217981644879628",
        "X-FB-LSD": "AVqbxe3J_YA",
        "X-ASBD-ID": "129477",
        "User-Agent": "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
    };

    const requestData = encodePostRequestData(postId);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers,
            body: requestData,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        const mediaData = data?.data?.xdt_shortcode_media;

        if (!mediaData) {
            throw new Error("No media data found.");
        }

        // Handle carousel posts
        if (mediaData.__typename === 'XDTGraphSidecar') {
            const mediaItems = mediaData.edge_sidecar_to_children?.edges || [];
            const mediaUrls = mediaItems.map(item => {
                const childMedia = item.node;
                return {
                    type: childMedia.is_video ? "video" : "image",
                    url: childMedia.is_video ? childMedia.video_url : childMedia.display_url,
                    dimensions: childMedia?.dimensions,
                };
            });

            return {
                type: "carousel",
                media: mediaUrls,
            };
        }

        // Check if it's a video
        if (mediaData?.is_video) {
            return {
                type: "video",
                url: mediaData.video_url,
                dimensions: mediaData?.dimensions,
            };
        } 

        // Handle single image posts
        if (mediaData?.display_url) {
            return {
                type: "image",
                url: mediaData.display_url,
                dimensions: mediaData?.dimensions,
            };
        } 

        throw new Error("Unknown media type.");

    } catch (error) {
        console.error("Error fetching media data: ", error);
        throw new Error("Error fetching media data.");
    }
};

// ... existing imports and code ...

// ... existing imports ...

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { postUrl } = req.body;
        const match = postUrl.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
        
        if (!match) {
            return res.status(400).json({ error: "Invalid Instagram URL" });
        }

        const postId = match[2];
        const mediaInfo = await fetchFromGraphQL(postId);

        if (mediaInfo.type === "carousel") {
            try {
                await fsPromises.mkdir(downloadsDir, { recursive: true });
                
                const zipFileName = `instagram_media_${Date.now()}.zip`;
                const zipFilePath = path.join(downloadsDir, zipFileName);
                
                const archive = archiver('zip');
                const output = createWriteStream(zipFilePath);

                archive.pipe(output);

                // Download and add each media file to the zip
                for (let i = 0; i < mediaInfo.media.length; i++) {
                    const media = mediaInfo.media[i];
                    console.log(`Downloading media ${i + 1}:`, media.url);
                    
                    const response = await fetch(media.url);
                    const buffer = await response.buffer();
                    
                    const extension = media.type === "video" ? "mp4" : "jpg";
                    archive.append(buffer, { name: `instagram_media_${i + 1}.${extension}` });
                }

                await new Promise((resolve, reject) => {
                    output.on('close', resolve);
                    archive.on('error', reject);
                    archive.finalize();
                });

                const zipBuffer = await fsPromises.readFile(zipFilePath);

                // Set headers for zip file download
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
                res.send(zipBuffer);

                // Clean up: Delete the zip file after sending
                setTimeout(async () => {
                    try {
                        await fsPromises.unlink(zipFilePath);
                    } catch (error) {
                        console.error('Error deleting zip file:', error);
                    }
                }, 1000);

            } catch (error) {
                console.error('Error creating zip:', error);
                return res.status(500).json({ error: 'Error creating zip file' });
            }
        } else {
            // Single media file
            res.status(200).json({
                fileUrl: mediaInfo.url,
                fileType: mediaInfo.type === "video" ? "mp4" : "jpg",
                dimensions: mediaInfo.dimensions
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}