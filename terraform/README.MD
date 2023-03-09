# AWS Deployment

## Pre-requirements
1) Installed [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2) AWS CLI [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) with [programmatic access](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
3) S3 bucket accessible by AWS CLI User


## Usage
To upload the latest tfvars use `bash upload-tfvars.sh`
To download the latest tfvars use `bash download-tfvars.sh`
to apply use `terraform apply`