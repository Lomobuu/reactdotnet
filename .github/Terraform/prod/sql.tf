resource "azurerm_mssql_server" "sqlServer" {
  name                         = local.sql_server_name
  resource_group_name          = data.azurerm_resource_group.rg.name
  location                     = data.azurerm_resource_group.rg.location
  administrator_login          = "mradministrator"
  administrator_login_password = azurerm_key_vault_secret.admin-pw.value
  version                      = "12.0" # required, fixed for Azure SQL
}

resource "azurerm_mssql_database" "sqlDB" {
  name           = local.sql_db_name
  server_id      = azurerm_mssql_server.sqlServer.id
  sku_name       = "Basic"  # closest equivalent to B_Gen5_1
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  max_size_gb    = 2
}



resource "azurerm_mssql_firewall_rule" "sqlfw" {
  name             = "allowAzure"
  server_id        = azurerm_mssql_server.sqlServer.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
