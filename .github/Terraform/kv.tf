data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "example" {
  name                        = "fozzen-reactdotnet-kv-${var.environment}"
  location                    = data.azurerm_resource_group.rg.location
  resource_group_name         = data.azurerm_resource_group.rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  rbac_authorization_enabled = true

  sku_name = "standard"
    tags = {
    Environment = var.environment
  }
}