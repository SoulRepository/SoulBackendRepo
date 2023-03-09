resource "aws_security_group" "rds_sg" {
  name                   = "${local.client}-db-sg"
  description            = "${local.client}-db-sg"
  revoke_rules_on_delete = false
  vpc_id                 = "vpc-0aaa416aaca192569" #default vpc

  egress {
    cidr_blocks      = ["0.0.0.0/0"]
    description      = ""
    from_port        = 0
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    protocol         = "-1"
    security_groups  = []
    self             = false
    to_port          = 0
  }

  ingress {
    cidr_blocks      = ["0.0.0.0/0"]
    description      = ""
    from_port        = -1
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    protocol         = "icmp"
    security_groups  = []
    self             = false
    to_port          = -1
  }

  ingress {
    cidr_blocks      = ["0.0.0.0/0"]
    description      = ""
    from_port        = 0
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    protocol         = "-1"
    security_groups  = []
    self             = false
    to_port          = 0
  }

  ingress {
    cidr_blocks      = ["0.0.0.0/0"]
    description      = ""
    from_port        = 5432
    ipv6_cidr_blocks = ["::/0"]
    prefix_list_ids  = []
    protocol         = "tcp"
    security_groups  = []
    self             = false
    to_port          = 5432
  }
  tags = {
    Name = "${local.client}-db-sg"
  }
}

resource "aws_iam_role" "monitoring_role" {
  name = "${local.client}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "monitoring_role-attach" {
  role = "${aws_iam_role.monitoring_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

resource "aws_db_subnet_group" "main" {
  name        = "${local.client}-db-subnet"
  description = "${local.client}-db-subnet"
  subnet_ids  = ["subnet-074456e1403e53d23", "subnet-0841e8585399aed2f", "subnet-0974b300122407b24"]
}

resource "aws_db_instance" "main" {
  publicly_accessible                   = false
  db_name                               = var.rds_db_name
  identifier                            = var.rds_db_name
  port                                  = 5432
  username                              = var.rds_username
  password                              = var.rds_password

  allocated_storage                     = var.rds_allocated_storage
  max_allocated_storage                 = var.rds_max_allocated_storage
  backup_retention_period               = var.rds_backup_retention_period
  storage_type                          = var.rds_storage_type
  storage_encrypted                     = true

  copy_tags_to_snapshot                 = true
  deletion_protection                   = true
  engine                                = "postgres"
  engine_version                        = "15.2"
  instance_class                        = var.rds_instance_class
  iops                                  = var.rds_iops
  license_model                         = "postgresql-license"
  multi_az                              = var.rds_multi_az
  parameter_group_name                  = "default.postgres15"

  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  monitoring_role_arn                   = aws_iam_role.monitoring_role.arn
  monitoring_interval                   = 60

  db_subnet_group_name                  = aws_db_subnet_group.main.name
  vpc_security_group_ids                = [aws_security_group.rds_sg.id]

  auto_minor_version_upgrade            = true
  allow_major_version_upgrade           = true

  apply_immediately                     = true
}

#module "rds_alarms" {
#  source                                          = "lorenzoaiello/rds-alarms/aws"
#  version                                         = "2.2.0"
#  db_instance_id                                  = "${aws_db_instance.main.id}"
#  db_instance_class                               =  "${aws_db_instance.main.instance_class}"
#  engine                                          = "${aws_db_instance.main.engine }"
#
#  cpu_utilization_too_high_threshold              = "80" #percent
#  cpu_credit_balance_too_low_threshold            = "30"
#  disk_queue_depth_too_high_threshold             = "64"
#  disk_free_storage_space_too_low_threshold       = "10000000000" #Byte
#  maximum_used_transaction_ids_too_high_threshold = "1000000000"
#  memory_freeable_too_low_threshold               = "256000000" #Byte
#  memory_swap_usage_too_high_threshold            = "256000000" #Byte
#
#  create_low_disk_burst_alarm = false
#  create_low_cpu_credit_alarm = true
#  anomaly_period	 ="1200"
#  anomaly_band_width = "10"
#  evaluation_period = "5"
#  statistic_period  = "60"
#}
