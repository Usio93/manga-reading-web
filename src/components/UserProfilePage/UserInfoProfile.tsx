import { FaCog } from 'react-icons/fa';
import React, { useState } from 'react';
import "../../styles/UserProfilePage/UserInfoProfile.scss";
import UserSettingsPopup from './UserSettingsPopup';
import { useUpdateUserProfile, useChangeAvatar } from "../../hooks";
import defaultAvatar from "../../assets/default_avatar.jpg";

interface UserData {
    id: string;
    username: string;
    avatarUrl?: string;
}

const UserInfo: React.FC<{ user: UserData }> = ({ user }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [userData, setUserData] = useState({
        ...user,
        avatarUrl: user.avatarUrl || defaultAvatar,
    });

    const IconCog = FaCog as React.FC;

    const { mutate: updateProfile } = useUpdateUserProfile();
    const { mutate: changeAvatar } = useChangeAvatar();

    const handleSave = (updatedUser: { name: string; avatarUrl: string }) => {
        // Cập nhật tên nếu thay đổi
        if (updatedUser.name !== userData.username) {
            updateProfile({ newName: updatedUser.name });
        }

        // Cập nhật avatar nếu thay đổi
        if (updatedUser.avatarUrl && updatedUser.avatarUrl !== userData.avatarUrl) {
            changeAvatar({ newAvatarUrl: updatedUser.avatarUrl });
        }

        // Cập nhật lại local UI
        setUserData((prev) => ({
            ...prev,
            username: updatedUser.name,
            avatarUrl: updatedUser.avatarUrl,
        }));
    };

    return (
        <>
            <div className="banner">
                <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
                    alt="Banner"
                    className="banner-img"
                />
                <div className="avatar-info">
                    <img src={userData.avatarUrl || defaultAvatar} alt="Avatar" className="profile-avatar" />

                    <div className="profile-text">
                        <p>{userData.username}</p>
                    </div>
                    <button className="settings-btn" onClick={() => setShowSettings(true)}>
                        <IconCog />
                    </button>
                </div>
            </div>

            <div className="content">
                <div className="left-actions">
                    <button className="follow">🍓 Follow</button>
                    <button>💬 Message</button>
                    <button>⚠️ Report</button>
                    <button>🔗 Linked</button>
                </div>

                <div className="right-info">
                    <h3 className="info-title">Information</h3>
                    <div className="info-box">
                        <p><strong>User name:</strong></p>
                        <p>{userData.username}</p>
                    </div>
                </div>
            </div>

            {showSettings && (
                <UserSettingsPopup
                    user={{
                        name: userData.username,
                        avatarUrl: userData.avatarUrl,
                    }}
                    userId={userData.id}
                    onClose={() => setShowSettings(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default UserInfo;