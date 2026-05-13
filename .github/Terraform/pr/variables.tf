variable "location" {
  type        = string
  description = "Azure region to deploy resources"
  default = "norwayeast"
}

variable "environment" {
  type        = string
  description = "Deployment environment (<prID>)"
  default = "dev"
}

variable "tags" {
  type        = map(string)
  description = "Common tags to apply to all resources"
  default     = {}
}

