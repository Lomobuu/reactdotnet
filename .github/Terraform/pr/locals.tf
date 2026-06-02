locals {
  # Normalise environment name, e.g. PR123 → pr123
  env  = lower(var.environment)
  base = "fznreactdotnet"

  # Web app
  webapp_name   = "${local.base}-appsvc-${local.env}"
  app_plan_name = "${local.base}-appplan-${local.env}"

  # Key Vault
  kv_name = "${local.base}-kv-${local.env}"

  # Observability
  log_analytics_name = "${local.base}-log-${local.env}"
  appi_name          = "${local.base}-appi-${local.env}"

  # Common tags
  all_tags = merge(
    {
      environment = local.env
      project     = local.base
    },
    var.tags
  )
}

output "webapp_name" {
  value = local.webapp_name
}
