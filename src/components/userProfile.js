import React from 'react';
import Image from 'next/image';
import { FaImage, FaUsers, FaUserFriends } from 'react-icons/fa';

const UserProfile = ({ userInfo }) => {
    if (!userInfo) return null;

    const { user } = userInfo.data;

    return (
        <div className="card shadow-lg border-0 rounded-lg mt-4">
            <div className="card-body p-4">
                <div className="row">
                    {/* Profile Picture */}
                    <div className="col-md-3 text-center">
                        <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                            <Image 
                                src={user.profile_pic_url_hd} 
                                alt={user.username}
                                className="rounded-circle"
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="150px"
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="col-md-9">
                        <h3 className="mb-2">{user.full_name}</h3>
                        <p className="text-muted">@{user.username}</p>

                        {/* Stats */}
                        <div className="row text-center mb-3">
                            <div className="col-4">
                                <div className="p-3 border rounded">
                                    <FaImage className="mb-2" />
                                    <h5>{user.edge_owner_to_timeline_media.count}</h5>
                                    <small>Posts</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="p-3 border rounded">
                                    <FaUsers className="mb-2" />
                                    <h5>{user.edge_followed_by.count}</h5>
                                    <small>Followers</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="p-3 border rounded">
                                    <FaUserFriends className="mb-2" />
                                    <h5>{user.edge_follow.count}</h5>
                                    <small>Following</small>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {user.biography && (
                            <div className="bio">
                                <h6>Bio</h6>
                                <p style={{ whiteSpace: 'pre-line' }}>{user.biography}</p>
                            </div>
                        )}

                        {/* External URL */}
                        {user.external_url && (
                            <a href={user.external_url} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="btn btn-outline-primary btn-sm">
                                Website
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;