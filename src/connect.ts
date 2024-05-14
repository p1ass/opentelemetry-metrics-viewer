import type { ConnectRouter } from '@connectrpc/connect'

import type { ExportMetricsServiceRequest } from '@buf/opentelemetry_opentelemetry.bufbuild_es/opentelemetry/proto/collector/metrics/v1/metrics_service_pb'
import { MetricsService } from '@buf/opentelemetry_opentelemetry.connectrpc_es/opentelemetry/proto/collector/metrics/v1/metrics_service_connect'
import type { PlainMessage } from '@bufbuild/protobuf'

export const routes = (router: ConnectRouter) =>
  router.service(MetricsService, {
    // implements rpc Say
    async export(req: PlainMessage<ExportMetricsServiceRequest>) {
      for (const resource of req.resourceMetrics) {
        console.log('Resource:', resource.resource)
        for (const scopeMetric of resource.scopeMetrics) {
          console.log('ScopeMetric', scopeMetric)
        }
      }
      return {
        partialSuccess: undefined,
      }
    },
  })
