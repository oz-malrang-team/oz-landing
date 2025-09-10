import React from 'react';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const ProfileTab = ({ userProfile }) => {
  return (
    <div className="px-5 space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
        <h3 className="text-lg font-bold text-rose-900 mb-4">개인 정보</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User size={20} className="text-rose-600" />
            <div>
              <p className="text-sm text-rose-600">이름</p>
              <p className="font-medium text-rose-900">{userProfile.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-rose-600" />
            <div>
              <p className="text-sm text-rose-600">이메일</p>
              <p className="font-medium text-rose-900">{userProfile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-rose-600" />
            <div>
              <p className="text-sm text-rose-600">전화번호</p>
              <p className="font-medium text-rose-900">{userProfile.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-rose-600" />
            <div>
              <p className="text-sm text-rose-600">가입일</p>
              <p className="font-medium text-rose-900">{userProfile.joinDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;