#!/bin/bash
set -e

#uncomment for debug purpose
#set -x
#export TF_LOG="DEBUG"
#export TF_LOG="WARN"
export TFE_PARALLELISM=75


PROJECT_NAME="soulsearch"

aws s3 cp s3://${PROJECT_NAME}-technical-bucket/terraform/tfvars/terraform.tfvars terraform.tfvars --profile blaize
