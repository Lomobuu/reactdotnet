resource "azurerm_container_registry" "acr" {
  name                = local.acr_name
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = false
    tags = {
    Environment = var.environment
  }
}


output "acr_id" {
  description = "Resource ID of the shared ACR — used by PR environments for AcrPull role assignment"
  value       = azurerm_container_registry.acr.id
}

output "acr_login_server" {
  description = "Login server of the shared ACR — passed to PR App Service app settings"
  value       = azurerm_container_registry.acr.login_server
}