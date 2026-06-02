variable "location" {
  type        = string
  description = "Azure region to deploy resources"
  default     = "norwayeast"
}

variable "environment" {
  type        = string
  description = "Deployment environment (e.g. pr123)"
}

variable "tags" {
  type        = map(string)
  description = "Common tags to apply to all resources"
  default     = {}
}

# --- Shared resources (from dev/test/prod) ---

variable "shared_acr_id" {
  type        = string
  description = "Resource ID of the shared Azure Container Registry (from dev/test/prod)"
}

variable "shared_acr_login_server" {
  type        = string
  description = "Login server hostname of the shared ACR, e.g. fznreactdotnetreg<env>.azurecr.io"
}

variable "shared_sql_connection_string" {
  type        = string
  sensitive   = true
  description = "Full ADO.NET connection string for the shared SQL database (from dev/test/prod)"
}
