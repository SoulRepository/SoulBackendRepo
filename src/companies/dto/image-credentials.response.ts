import { PresignedPost } from '@aws-sdk/s3-presigned-post/dist-types/createPresignedPost';

export class ImageCredentialsResponse {
  background: PresignedPost;
  featured: PresignedPost;
  logo: PresignedPost;
}
