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


## Pull request environment setup
### Setup
Must add OIDC authentication in github for pull request
Must add Subscription scope contributor access
Be wary of keeping pull requests open because of large costs due to multiple environments
PRenv RG must already exist
Must have a seperate folder for the pr to be able to create its own resource group(also need diff config)
Must have in terraform for the PR ENV a AcrPull Role assignment, meaning the service principal also must have rbac to give rbac.
1. Create new branch
2. Pull request into dev
3. Triggers bootstrap for storage account to host terraform state
4. Triggers to create infrastructure in its own resource group based on the PRID
5. Based on successful infrastructure creation, triggers a docker build & deploy pipeline
