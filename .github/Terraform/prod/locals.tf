locals {
  # Make the environment lower-case, e.g. PR123 → pr123
  env = lower(var.environment)

  # Your base project name
  base = "fznreactdotnet"

  # Storage account: no dashes allowed
  storage_account_name = "${local.base}strg${local.env}"

  # ACR - no dashes allowed
  acr_name         = "${local.base}reg${local.env}"
  acr_login_server = "${local.acr_name}.azurecr.io"

  # Web app
  webapp_name = "${local.base}-appsvc-${local.env}"
  app_plan_name = "${local.base}-appplan-${local.env}"

  #
  kv_name = "${local.base}-kv-${local.env}"

  # Tags
  all_tags = merge(
    {
      environment = local.env
      project     = local.base
    },
    var.tags
  )
}

output "acr_name" {
  value = local.acr_name
}
output "acr_login_server" {
  value = acr_login_server
}
output "webapp_name" {
  value = webapp_name
}