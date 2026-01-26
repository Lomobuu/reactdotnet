resource "azurerm_container_registry" "acr" {
  name                = "fozzen-reactdotnet-reg${var.environment}"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  sku                 = "Premium"
  admin_enabled       = false
    tags = {
    Environment = var.environment
  }
}
