# Main provider for almost all resources
provider "aws" {
  region                  = local.aws_region
  profile                 = local.profile
}

# Second provider for using N. Virginia region for Certificate Manager
provider "aws" {
  alias                   = "us-east-1"
  region                  = "us-east-1"
  shared_credentials_files = ["$HOME/.aws/credentials"]
  profile                 = local.profile
}
