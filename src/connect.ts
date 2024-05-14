import type {ConnectRouter} from '@connectrpc/connect'
import {
  MetricsService
} from '@buf/opentelemetry_opentelemetry.connectrpc_es/opentelemetry/proto/collector/metrics/v1/metrics_service_connect'
import {MetricsServiceImpl} from "./metrics";

export const routes = (router: ConnectRouter) =>
  router.service(MetricsService, {
    export: MetricsServiceImpl.export,
  })
