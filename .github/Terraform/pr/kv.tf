data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "keyvault" {
  name                        = local.kv_name
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  rbac_authorization_enabled = true

    network_acls {
    bypass           = "AzureServices"
    default_action   = "Allow"

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




resource "azurerm_key_vault_secret" "ConnectionStringSecret" {
  name = "sql-connectionstring"

  value = "sqlserver://${azurerm_mssql_server.sqlServer.name}.database.windows.net:1433;database=${azurerm_mssql_database.sqlDB.name};user=${azurerm_mssql_server.sqlServer.administrator_login};password=${azurerm_mssql_server.sqlServer.administrator_login_password};encrypt=true;trustServerCertificate=false"

  key_vault_id = azurerm_key_vault.keyvault.id

  depends_on = [azurerm_role_assignment.kv_admin]
}



resource "random_password" "admin-pw" {
  length = 16
  min_numeric = 4
  special = true
  override_special = "_%@"
}

resource "azurerm_key_vault_secret" "admin-pw" {
  name         = "admin-pw"
  key_vault_id = azurerm_key_vault.keyvault.id
  value        = random_password.admin-pw.result

  depends_on = [
    azurerm_role_assignment.kv_admin
  ]
}