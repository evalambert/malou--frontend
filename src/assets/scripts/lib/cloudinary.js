// src/lib/cloudinary.js

export const getCloudinaryUrl = (src, { width = 400, quality = 'auto:best' } = {}) => {
  if (!src || !src.includes('res.cloudinary.com')) return src;

  return src.replace(
      '/upload/',
      `/upload/w_${width},q_${quality},f_auto/`
  );
};