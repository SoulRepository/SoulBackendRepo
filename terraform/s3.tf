data "aws_iam_policy_document" "s3_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions   = ["s3:GetObject"]
    principals {
      type = "AWS"
      identifiers = module.cdn.cloudfront_origin_access_identity_iam_arns
    }
    resources = [
      "${module.s3_bucket.s3_bucket_arn}/*",
    ]
  }
}

module "s3_bucket" {
  version = "3.7.0"
  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "${local.client}"
#  acl    = "private" #public-read
  force_destroy = false

   # Bucket policies
  attach_policy                         = true
  policy                                = data.aws_iam_policy_document.s3_policy.json
}
