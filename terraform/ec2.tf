data "aws_iam_policy" "AmazonRoute53FullAccess" {
  name = "AmazonRoute53FullAccess"
}

data "aws_iam_policy" "AmazonVPCFullAccess" {
  name = "AmazonVPCFullAccess"
}

resource "aws_iam_policy" "s3_policy_access" {
  name        = "${local.client}-s3-access"
  path        = "/"
  description = "Policy to allow instances interact with ${local.client} buckets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
          "s3:GetObjectAcl",
          "s3:DeleteObject"
        ]
        Resource = [
      "${module.s3_bucket.s3_bucket_arn}/*",
      "${module.s3_bucket.s3_bucket_arn}"
        ]
      }
    ]
  })
}

resource "aws_iam_role" "soulsearch" {
  name        = "${local.client}"
  description = "Allows EC2 instances to call AWS services on your behalf."

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ec2.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })

  managed_policy_arns = [aws_iam_policy.s3_policy_access.arn, data.aws_iam_policy.AmazonVPCFullAccess.arn, data.aws_iam_policy.AmazonRoute53FullAccess.arn]
}

resource "aws_iam_instance_profile" "soulsearch" {
  name = local.client
  role = aws_iam_role.soulsearch.id
}

data "aws_security_group" "soulsearch" {
  name   = "${local.client}"
  depends_on = [aws_security_group.soulsearch]
}

resource "aws_security_group" "soulsearch" {
  name   = "${local.client}"
  vpc_id = "vpc-0aaa416aaca192569" #default vpc
  description = "Security group for ${local.client}"

  #Incoming traffic
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    description = "Allow ssh connect"
    cidr_blocks = ["0.0.0.0/0"] #replace it with your ip address
  }

  ingress {
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"] #replace it with your ip address
  }

  #Outgoing traffic
  egress {
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"] #replace it with your ip address
  }

  tags = {
    "Name" = "${local.client}"
  }
}

module "ec2_instance_soulsearch" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 3.0"

  name = "${local.client}"

  ami                    = "ami-0d1ddd83282187d18"  #data.aws_ami.ubuntu.id
  iam_instance_profile   = aws_iam_instance_profile.soulsearch.name
  instance_type          = "t2.micro"
  key_name               = "bortnik-mac"
  monitoring             = true
  vpc_security_group_ids = ["${data.aws_security_group.soulsearch.id}"]
  subnet_id              = "subnet-074456e1403e53d23"
  disable_api_termination = "true"

  tags = {
    Name = local.client
  }
}

resource "aws_eip" "client-app-ip" {
  instance = module.ec2_instance_soulsearch.id
  vpc      = true

  tags = {
    Name = local.client
  }
}
