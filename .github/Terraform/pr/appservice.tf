resource "azurerm_app_service_plan" "appPlan" {
  name                = local.app_plan_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_app_service" "AppSvc" {
  name                = local.webapp_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.appPlan.id

  # Set container to a default template; replaced by CD pipeline
  site_config {
    linux_fx_version                     = "DOCKER|mcr.microsoft.com/azuredocs/aci-helloworld:latest"
    acr_use_managed_identity_credentials = true
  }

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.appi.connection_string
    # Let the app know which ACR to pull from (useful for CD pipelines)
    ACR_LOGIN_SERVER                      = var.shared_acr_login_server
  }

  connection_string {
    name  = "Database"
    type  = "SQLAzure"
    value = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.ConnectionStringSecret.id})"
  }

  identity {
    type = "SystemAssigned"
  }

  # Don't overwrite the image once the CD pipeline has deployed a real one
  lifecycle {
    ignore_changes = [
      site_config[0].linux_fx_version,
    ]
  }

  tags = {
    Environment = var.environment
  }
}

# Allow the App Service managed identity to pull images from the shared ACR
resource "azurerm_role_assignment" "acrrole" {
  role_definition_name = "AcrPull"
  scope                = var.shared_acr_id
  principal_id         = azurerm_app_service.AppSvc.identity[0].principal_id
}
