data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "keyvault" {
  name                        = local.kv_name
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  rbac_authorization_enabled  = true

  network_acls {
    bypass         = "AzureServices"
    default_action = "Allow"
  }

  sku_name = "standard"

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_role_assignment" "kv_admin" {
  scope                = azurerm_key_vault.keyvault.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

# Store the shared SQL connection string so the App Service can reference it
# via Key Vault reference — no SQL resources are created in this environment
resource "azurerm_key_vault_secret" "ConnectionStringSecret" {
  name         = "sql-connectionstring"
  value        = var.shared_sql_connection_string
  key_vault_id = azurerm_key_vault.keyvault.id

  depends_on = [azurerm_role_assignment.kv_admin]
}

# Grant the App Service managed identity read access to secrets
resource "azurerm_role_assignment" "kv_appsvc_reader" {
  scope                = azurerm_key_vault.keyvault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_app_service.AppSvc.identity[0].principal_id
}
