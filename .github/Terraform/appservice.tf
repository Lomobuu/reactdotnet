resource "azurerm_app_service_plan" "appPlan" {
  name                = "fozzen-reactdotnet-appplan${var.environment}"
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
  name                = "fozzen-reactdotnet-appsvc${var.environment}"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.appPlan.id

# Set container to a default template
  site_config {
    linux_fx_version = "DOCKER|mcr.microsoft.com/azuredocs/aci-helloworld:latest"
  }

    identity {
    type = "SystemAssigned"
  }

app_settings = {
  WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
  DOCKER_REGISTRY_SERVER_URL          = "https://${azurerm_container_registry.acr.login_server}"
}

# Make sure template only set at first creation as well as authentication to ACR registry
  lifecycle {
  ignore_changes = [
    site_config[0].linux_fx_version,
    app_settings["DOCKER_REGISTRY_SERVER_URL"]
  ]
}

    tags = {
    Environment = var.environment
  }
  }