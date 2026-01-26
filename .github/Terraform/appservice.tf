resource "azurerm_app_service_plan" "appPlan" {
  name                = "fozzen-reactdotnet-appplan${var.environment}"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name

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

    tags = {
    Environment = var.environment
  }
  }