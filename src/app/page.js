// src/app/page.js

"use client"; // Marking this component as a client component.

import MediaDownloader from '@/components/MediaDownloader';

const HomePage = () => {
  return (
    <div>
      {/* <h1>Instagram Media Downloader</h1> */}
      <MediaDownloader />
    </div>
  );
};

export default HomePage;
