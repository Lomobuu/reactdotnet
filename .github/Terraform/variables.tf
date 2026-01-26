variable "location" {
  type        = string
  description = "Azure region to deploy resources"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev, test, prod)"
}

variable "tags" {
  type        = map(string)
  description = "Common tags to apply to all resources"
  default     = {}
}