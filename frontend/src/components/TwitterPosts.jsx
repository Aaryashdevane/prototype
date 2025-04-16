import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TwitterPosts.css";

const TwitterPosts = () => {
    const [twitterPosts, setTwitterPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:8000/twitter-posts") // Replace with your backend endpoint for Twitter posts
            .then((response) => {
                setTwitterPosts(response.data.posts);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching Twitter posts:", error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="twitter-container">
            {isLoading ? (
                <div className="twitter-grid">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="twitter-card skeleton-card">
                            <div className="skeleton-profile"></div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text short"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="twitter-grid">
                    {twitterPosts.map((post, index) => (
                        <div key={index} className="twitter-card">
                            {/* Author Section */}
                            <div className="twitter-author">
                                <img
                                    src={post.author.profilePicture}
                                    alt={post.author.name}
                                    className="twitter-profile-picture"
                                />
                                <div className="twitter-author-info">
                                    <span className="twitter-author-name">{post.author.name}</span>
                                    <span className="twitter-author-username">@{post.author.userName}</span>
                                </div>
                            </div>

                            {/* Post Content */}
                            <p className="twitter-text">{post.fullText}</p>

                            {/* Media Section */}
                            {post.media_url_https && (
                                <img
                                    src={post.media_url_https}
                                    alt="Tweet Media"
                                    className="twitter-media"
                                />
                            )}

                            {/* Footer Section */}
                            <div className="twitter-footer">
                                <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="twitter-view-link"
                                >
                                    View Tweet
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TwitterPosts;