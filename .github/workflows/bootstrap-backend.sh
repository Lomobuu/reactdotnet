#!/bin/bash
set -e

# Input variables
ENV=$1  # dev, test, prod
RESOURCE_GROUP="reactdotnet-management-RG"
LOCATION="westeurope"
STORAGE_ACCOUNT="tfstatereactdotnetfozzen"
CONTAINER_NAME="tfstate-${ENV,,}"

echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "Creating storage account..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2

echo "Creating blob container..."
ACCOUNT_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT \
  --query "[0].value" -o tsv)

az storage container create \
  --name $CONTAINER_NAME \
  --account-name $STORAGE_ACCOUNT \
  --account-key $ACCOUNT_KEY

echo "Storage account '$STORAGE_ACCOUNT' and container '$CONTAINER_NAME' created."