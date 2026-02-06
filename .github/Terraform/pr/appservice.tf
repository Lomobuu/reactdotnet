resource "azurerm_app_service_plan" "appPlan" {
  name                = "fozzen-reactdotnet-appplan${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind     = "Linux"
  reserved = true

  sku {
    tier = "Standard"
    size = "S1" ## TODO: CHANGE TO BASIC
  }
    tags = {
    Environment = var.environment
  }
}

resource "azurerm_app_service" "AppSvc" {
  name                = "fozzen-reactdotnet-appsvc${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.appPlan.id

# Set container to a default template
  site_config {
    linux_fx_version = "DOCKER|mcr.microsoft.com/azuredocs/aci-helloworld:latest"
    acr_use_managed_identity_credentials = true
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