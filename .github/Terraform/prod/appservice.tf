resource "azurerm_app_service_plan" "appPlan" {
  name                = local.app_plan_name
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  kind     = "Linux"
  reserved = true

  sku {
    tier = "Standard"
    size = "S1"
  }
    tags = {
    Environment = var.environment
  }
}

resource "azurerm_app_service" "AppSvc" {
  name                = local.webapp_name
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.appPlan.id

# Set container to a default template
  site_config {
    linux_fx_version = "DOCKER|mcr.microsoft.com/azuredocs/aci-helloworld:latest"
    acr_use_managed_identity_credentials = true
  }

app_settings = {
  APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.appi.connection_string
  "ConnectionStrings__DefaultConnection"         = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.ConnectionStringSecret.id})"
}

    identity {
    type = "SystemAssigned"
  }


# Make sure template only set at first creation as well as authentication to ACR registry
  lifecycle {
  ignore_changes = [
    site_config[0].linux_fx_version,
  ]
}

    tags = {
    Environment = var.environment
  }
  }
  
    # Give new role assignment AcrPull to identity that pulls image from container registry
resource "azurerm_role_assignment" "acrrole" {
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
  principal_id         = azurerm_app_service.AppSvc.identity[0].principal_id
}