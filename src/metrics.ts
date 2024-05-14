import type {PlainMessage} from "@bufbuild/protobuf";
import type {
  ExportMetricsServiceRequest,
  ExportMetricsServiceResponse
} from "@buf/opentelemetry_opentelemetry.bufbuild_es/opentelemetry/proto/collector/metrics/v1/metrics_service_pb";

async function _export(req: PlainMessage<ExportMetricsServiceRequest>):Promise<PlainMessage<ExportMetricsServiceResponse>>  {
  for (const resource of req.resourceMetrics) {
    console.log( resource.resource)
    for (const scopeMetric of resource.scopeMetrics) {
      console.log( scopeMetric)
    }
  }
  return {
    partialSuccess: undefined,
  }
}

export const MetricsServiceImpl = {
   export: _export,
}
