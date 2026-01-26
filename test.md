# Overview
Steps to set up environment ready to deploy application

## Infrastructure Code Setup
Create infrastructure code:
- Terraform code with variables, tags and naming
- Setup backend code with script, pointing to a created RG to setup a management storage account for terraform.tfstate file.
- setup terraform plan, apply and optionally destroy
## Azure RG, SA, RBAC Setup
- Create management Resource Group in Azure
- Create Service Principal in Azure (Entra ID->App Registration)
- Setup Federated Credentials for the branches / environments
- Give SA owner to resource group in Azure
- Create <name>-<environment>-RG groups.
## Git Setup
- Setup Github Action Credentials for Authentication with Azure
- Setup Environments approval gates
