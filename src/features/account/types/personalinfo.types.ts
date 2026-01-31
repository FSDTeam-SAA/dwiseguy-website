export interface AvatarInfo {
    duration: number | null;
    public_id: string;
    url: string;
    file_type: string;
}

export interface VerificationInfo {
    verified: boolean;
    verificationOtp: string | null;
}

export interface UserData {
    avatar: AvatarInfo;
    verificationInfo: VerificationInfo;
    _id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    password_reset_Otp: string | null;
    password_reset_token: string;
    password_reset_otp_expires: string | null;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    age: number;
}

export interface UpdateUserResponse {
    success: boolean;
    message: string;
    data: UserData;
}
