import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InstaPosts.css";

const InstaPosts = () => {
    const [socialPosts, setSocialPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visiblePosts, setVisiblePosts] = useState(8); // Number of posts to show initially

    useEffect(() => {
        axios
            .get("http://localhost:8000/posts") // Ensure FastAPI is running
            .then((response) => {
                setSocialPosts(response.data.posts); // ✅ Access the `posts` key from the response
                setIsLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("❌ Error fetching posts:", error);
                setIsLoading(false); // Set loading to false even if there's an error
            });
    }, []);

    const loadMorePosts = () => {
        setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 8); // Show 8 more posts
    };

    return (
    <div className="techniques-container">
        {/* Show Skeleton Loader while loading */}
        {isLoading ? (
            <div className="social-grid">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="social-card skeleton-card">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text short"></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="social-grid">
                {socialPosts.slice(0, visiblePosts).map((post, index) => (
                    <div key={index} className="social-card">
                        {/* Render image if type is "Image" or "Sidecar" */}
                        {(post.type === "Image" || post.type === "Sidecar") && post.media && (
                            <img src={post.media} alt={post.caption} className="social-media-image" />
                        )}
                        {/* Render video if type is "Video" */}
                        {post.type === "Video" && post.media && (
                            <video width="100%" height="200" controls>
                                <source src={post.media} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        {/* Render fallback for other types */}
                        {post.type !== "Image" && post.type !== "Video" && post.type !== "Sidecar" && (
                            <p>Unsupported media type: {post.type}</p>
                        )}

                        {/* Caption with line clipping */}
                        <div className="caption-container">
                            <p className="caption">
                                {post.caption.length > 300
                                    ? `${post.caption.substring(0, 300)}...`
                                    : post.caption}
                            </p>
                            {post.caption.length > 300 && (
                                <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="see-more"
                                >
                                    See More
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Show More Button */}
        {!isLoading && visiblePosts < socialPosts.length && (
            <button className="show-more-button" onClick={loadMorePosts}>
                Show More
            </button>
        )}
    </div>
);
};

export default InstaPosts;