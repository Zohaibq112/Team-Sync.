variable "aws_region"    { default = "us-east-1" }
variable "app_name"      { default = "mern-app" }
variable "key_name"      { description = "EC2 key pair name" }
variable "mongodb_uri"   { sensitive = true }
variable "ecr_image_uri" { description = "Full ECR image URI with tag" }
variable "ecr_registry"  { description = "ECR registry URL without image name" }