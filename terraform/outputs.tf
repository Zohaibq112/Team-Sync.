output "backend_ip"   { value = aws_instance.backend.public_ip }
output "backend_url"  { value = "http://${aws_instance.backend.public_ip}:3000" }
output "frontend_url" { value = aws_s3_bucket_website_configuration.frontend.website_endpoint }