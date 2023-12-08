import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'

const DVideoPlayer = ({ url }) => {
    const [cachedUrl, setCachedUrl] = useState(null)

    useEffect(() => {
        console.log('Debug 1------', url)

        let cache = null // Declare cache outside of the async function scope

        const fetchAndCacheVideo = async () => {
            try {
                const cacheName = 'my-video-cache'
                cache = await caches.open(cacheName)
                const cachedResponse = await cache.match(url)

                if (cachedResponse) {
                    // If the video is already cached, use the cached response
                    const blob = await cachedResponse.blob()
                    const cachedFile = new File([blob], 'video.mp4', {
                        type: 'video/mp4',
                    })
                    setCachedUrl(URL.createObjectURL(cachedFile))
                    console.log('Debug 2---------', cachedFile)
                } else {
                    // If the video is not cached, fetch it and store it in the cache
                    const response = await fetch(url)
                    console.log('Debug 3---------', response)
                    await cache.put(url, response.clone())
                    const blob = await response.blob()
                    console.log('Debug 4---------', blob)
                    const downloadedFile = new File([blob], 'video.mp4', {
                        type: 'video/mp4',
                    })
                    console.log('Debug 5---------', downloadedFile)
                    setCachedUrl(URL.createObjectURL(downloadedFile))
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchAndCacheVideo()

        return () => {
            // Remove the cache and the video when the component is unmounted
            if (cache) {
                cache.delete(url)
            }
            URL.revokeObjectURL(cachedUrl)
        }
    }, [url])

    return <ReactPlayer url={cachedUrl} controls={true} playsinline />
}

export default DVideoPlayer

// import React, { useState, useEffect } from 'react'
// import ReactPlayer from 'react-player'

// const DVideoPlayer = ({ url }) => {
//     const [cachedUrl, setCachedUrl] = useState(null)

//     const fetchAndCacheVideo = async () => {
//         try {
//             const cacheName = 'my-video-cache'
//             const cache = await caches.open(cacheName)
//             const cachedResponse = await cache.match(url)

//             if (cachedResponse) {
//                 // If the video is already cached, use the cached response
//                 const blob = await cachedResponse.blob()
//                 const cachedFile = new File([blob], 'video.mp4', {
//                     type: 'video/mp4',
//                 })
//                 setCachedUrl(URL.createObjectURL(cachedFile))
//                 console.log('Debug 2---------', cachedFile)
//             } else {
//                 // If the video is not cached, fetch it and store it in the cache
//                 const response = await fetch(url)
//                 console.log('Debug 3---------', response)
//                 await cache.put(url, response.clone())
//                 const blob = await response.blob()
//                 console.log('Debug 4---------', blob)
//                 const downloadedFile = new File([blob], 'video.mp4', {
//                     type: 'video/mp4',
//                 })
//                 console.log('Debug 5---------', downloadedFile)
//                 setCachedUrl(URL.createObjectURL(downloadedFile))
//             }
//         } catch (error) {
//             console.error(error)
//         }
//     }

//     useEffect(() => {
//         console.log('DEbug 1------', url)

//         fetchAndCacheVideo()
//     }, [url])

//     return <ReactPlayer url={cachedUrl} controls={true} />
// }

// export default DVideoPlayer

// import React, { useState } from 'react';
// import axios from 'axios';
// import ReactPlayer from 'react-player';

// const DVideoPlayer = ({ url }) => {
//   const [videoUrl, setVideoUrl] = useState('');

//   const downloadVideo = async () => {
//     const response = await axios.get(url, {
//       responseType: 'blob', // tell axios to return a Blob object
//     });
//     const blob = new Blob([response.data], { type: 'video/mp4' }); // create a Blob object from the response data
//     const urlObject = window.URL || window.webkitURL;
//     const videoUrl = urlObject.createObjectURL(blob); // create a URL object from the Blob object
//     setVideoUrl(videoUrl);
//   };

//   return (
//     <div>
//       <button onClick={downloadVideo}>Download Video</button>
//       {videoUrl && <ReactPlayer url={videoUrl} controls={true} />}
//     </div>
//   );
// };

// export default DVideoPlayer;

// import React, { useState } from 'react';
// import axios from 'axios';
// import ReactPlayer from 'react-player';

// const DVideoPlayer = props => {
//   const [videoUrl, setVideoUrl] = useState('');

//   const downloadVideo = async () => {
//     const url = props.url // replace with your signed URL
//     const response = await axios.get(url, {
//       responseType: 'blob', // tell axios to return a Blob object
//     });
//     const blob = new Blob([response.data], { type: 'video/mp4' }); // create a Blob object from the response data
//     const urlObject = window.URL || window.webkitURL;
//     const videoUrl = urlObject.createObjectURL(blob); // create a URL object from the Blob object
//     setVideoUrl(videoUrl);
//   };

//   return (
//     <div>
//       <button onClick={downloadVideo}>Download Video</button>
//       {videoUrl && <ReactPlayer url={videoUrl} controls={true} />}
//     </div>
//   );
// };

// export default DVideoPlayer;
