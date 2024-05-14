# OpenTelemetry Metrics Viewer

## Start Server

```shell
pnpm config set @buf:registry https://buf.build/gen/npm/v1/

pnpm install
pnpm run dev
```

```shell
open http://localhost:3000
```

## Call API

```shell
buf curl \
  --protocol grpc \
  --schema buf.build/opentelemetry/opentelemetry \
  --http2-prior-knowledge \
  --data @examples/metrics.json \
  http://localhost:3000/opentelemetry.proto.collector.metrics.v1.MetricsService/Export

```
