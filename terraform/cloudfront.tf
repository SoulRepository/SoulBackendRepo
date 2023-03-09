data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}


module "cdn" {
  version = "2.9.3"
  source  = "terraform-aws-modules/cloudfront/aws"
  aliases = [local.domain]
  comment = "CDN for ${local.client} client"
  enabled = true
  is_ipv6_enabled = true
  http_version  = "http2and3"
  price_class = "PriceClass_All"
  wait_for_deployment = false
  retain_on_delete = false


  create_origin_access_identity = true
  origin_access_identities = {
    awesome_s3 = "CDN for ${local.client} client"
  }

  origin = {
    awesome_s3 = {
      domain_name = module.s3_bucket.s3_bucket_bucket_regional_domain_name
      s3_origin_config = {
        origin_access_identity = "awesome_s3"
      }

    }
  }

  default_cache_behavior = {
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
    target_origin_id       = "awesome_s3"
    viewer_protocol_policy = "allow-all"
    use_forwarded_values = false

    compress        = true
  }


  default_root_object = "index.html"
  custom_error_response = {
    error403 = {
      error_code         = 403
      response_code      = 200
      response_page_path = "/index.html"
    }
    error404 = {
      error_code         = 404
      response_code      = 404
      response_page_path = "/404.html"
    }
  }


  viewer_certificate = {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method  = "sni-only"
  }
}

data "aws_cloudfront_cache_policy" "ManagedCachingOptimized" {
  name = "Managed-CachingOptimized"
}
