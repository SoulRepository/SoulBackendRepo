resource "aws_acm_certificate" "cert" {
  provider          = aws.us-east-1
  domain_name       = local.domain

  validation_method = "DNS"

  tags = {
    client = local.client
  }

  lifecycle {
    create_before_destroy = true
  }
}
