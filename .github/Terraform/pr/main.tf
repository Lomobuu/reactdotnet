terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~> 4.58.0"
    }
  }
backend "azurerm" {}
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
  use_oidc = true
  resource_provider_registrations = "none"
}

resource "azurerm_resource_group" "rg" {
  name = "reactdotnet-${var.environment}-RG"
  location = var.location
  }