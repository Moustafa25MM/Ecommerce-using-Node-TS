import { cloudi } from './imagesUpload';

const clearImage = (publicId: string) => {
  cloudi.uploader.destroy(
    publicId,
    { invalidate: true },
    (error: any, result: any) => {
      if (error) {
        throw error;
      }
    }
  );
};

export default clearImage;
