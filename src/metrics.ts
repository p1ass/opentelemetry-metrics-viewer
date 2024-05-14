import type {PlainMessage} from "@bufbuild/protobuf";
import type {
  ExportMetricsServiceRequest,
  ExportMetricsServiceResponse
} from "@buf/opentelemetry_opentelemetry.bufbuild_es/opentelemetry/proto/collector/metrics/v1/metrics_service_pb";

async function _export(req: PlainMessage<ExportMetricsServiceRequest>):Promise<PlainMessage<ExportMetricsServiceResponse>>  {
  for (const resource of req.resourceMetrics) {
    console.log('',resource.resource)
    for (const scopeMetric of resource.scopeMetrics) {
      console.log(scopeMetric.scope)
      for (const metric of scopeMetric.metrics){
        switch (metric.data.case){
          case 'gauge':
            console.log("====== Gauge Metric ======")
            break
          case 'sum':
            console.log("====== Sum Metric ======")
            break
          case 'histogram':
            console.log("====== Histogram Metric ======")
            break
          case 'exponentialHistogram':
            console.log("====== ExponentialHistogram Metric ======")
            break
          case 'summary':
            console.log("====== Summary Metric ======")
            break
        }
        console.log(metric)
      }
    }
  }
  return {
    partialSuccess: undefined,
  }
}

export const MetricsServiceImpl = {
   export: _export,
}


