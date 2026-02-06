#!/bin/bash
set -e

# Usage: ./backend-pr.sh <pr_number> (Runs automatically from terraform-pr.yaml)

PR_ID=$1
if [ -z "$PR_ID" ]; then
  echo "Usage: $0 <pull_request_id>"
  exit 1
fi

RESOURCE_GROUP="prenv-management-RG"
LOCATION="westeurope"
STORAGE_ACCOUNT="tfstateprenvfozzen"
CONTAINER_NAME="tfstate-pr${PR_ID}"

echo "Setting up Terraform backend for Pull Request #${PR_ID}"

# Ensure storage account exists
if ! az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
  echo "Creating storage account..."
  az storage account create \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --kind StorageV2
else
  echo "Storage account '$STORAGE_ACCOUNT' already exists."
fi

# Get account key
ACCOUNT_KEY=$(az storage account keys list \
  --resource-group "$RESOURCE_GROUP" \
  --account-name "$STORAGE_ACCOUNT" \
  --query "[0].value" -o tsv)

# Create unique PR container
echo "Creating blob container for PR '$PR_ID'..."
az storage container create \
  --name "$CONTAINER_NAME" \
  --account-name "$STORAGE_ACCOUNT" \
  --account-key "$ACCOUNT_KEY" \
  --output none

echo "✅ Created container '$CONTAINER_NAME' in storage account '$STORAGE_ACCOUNT'."