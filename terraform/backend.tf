terraform {
  backend "s3" {
      bucket               = "soulsearch-technical-bucket"
      key                  = "terraform/soulsearch/tfstate"
      region               = "eu-central-1"
      profile              = "blaize"
  }
}
