variable "rds_password" {
  type      = string
  sensitive = true
}

variable "rds_db_name" {
  type      = string
  sensitive = true
}

variable "rds_username" {
  type      = string
  sensitive = true
}

variable "rds_allocated_storage" {
  type = string
}

variable "rds_max_allocated_storage" {
  type = string
}

variable "rds_multi_az" {
  type = string
}

variable "rds_storage_type" {
  type = string
}

variable "rds_iops" {
  type = string
}

variable "rds_instance_class" {
  type = string
}

variable "rds_backup_retention_period" {
  type = string
}
