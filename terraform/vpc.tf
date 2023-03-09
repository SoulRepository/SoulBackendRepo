#data "aws_availability_zones" "available" {}
#
#
#
#resource "random_integer" "octet" {
#  min     = 0
#  max     = 255
#  keepers = {
#   netname = var.netname
#  }
#}
#
#module "vpc" {
#  source  = "terraform-aws-modules/vpc/aws"
#  version = "3.2.0"
#
#  name                  = "${local.env}-vpc"
#  cidr                  = "${cidrsubnet("${var.subnet}", 8, random_integer.octet.result)}"
#  azs                   = data.aws_availability_zones.available.names
#
#  tags = {
#    "Name" = "${local.env}"
#  }
#}
#
##data "aws_subnet_ids" "all_vpc_subnets" {
##  vpc_id = module.vpc.vpc_id
##
##  depends_on = [
##    module.vpc.private_subnets,
##    module.vpc.public_subnets,
##  ]
##}