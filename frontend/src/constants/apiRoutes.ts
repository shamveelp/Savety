export const API_ROUTES = {
  USER_AUTH: {
    SIGNUP: '/user/auth/signup',
    LOGIN: '/user/auth/login',
    VERIFY_OTP: '/user/auth/verify-otp',
    FORGOT_PASSWORD: '/user/auth/forgot-password',
    RESET_PASSWORD: '/user/auth/reset-password',
  },
  USER_PROFILE: {
    PROFILE: '/profile',
    AVATAR: '/avatar',
    CHANGE_PASSWORD: '/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  UPLOADS: {
    BASE: '/uploads',
    EXPLORE: '/uploads/explore',
    LIKE: (id: string) => `/uploads/${id}/like`,
    SHARE: (id: string) => `/uploads/${id}/share`,
    PUBLIC_PROFILE: (userId: string) => `/uploads/profile/${userId}`,
    BY_SLUG: (username: string, slug: string) => `/uploads/s/${username}/${slug}`,
  }
};
