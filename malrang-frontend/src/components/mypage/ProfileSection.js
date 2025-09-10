import React from 'react';
import { Share2 } from 'lucide-react';

const ProfileSection = ({ 
  userProfile, 
  onShareProfile 
}) => {
  return (
    <div className="bg-white p-6 m-5 rounded-3xl shadow-lg border border-rose-200">
      <div className="flex gap-4 mb-6">
        <div className="flex-shrink-0">
          {userProfile?.profileImage ? (
            <img
              src={userProfile.profileImage}
              alt="프로필 사진"
              className="w-16 h-16 rounded-full object-cover border-2 border-rose-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-lg text-white font-bold">
              {userProfile?.name?.charAt(0) || '😊'}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-rose-900 mb-2">{userProfile?.name}</h2>
          <p className="text-rose-600 text-sm mb-3">{userProfile?.bio}</p>
          <div className="text-sm text-rose-500">
            {userProfile?.joinDate && (
              <p>가입일: {new Date(userProfile.joinDate).toLocaleDateString('ko-KR')}</p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onShareProfile}
            className="bg-rose-100 text-rose-700 px-4 py-2 rounded-xl text-sm hover:bg-rose-200 transition-colors flex items-center gap-2"
          >
            <Share2 size={16} />
            공유
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;