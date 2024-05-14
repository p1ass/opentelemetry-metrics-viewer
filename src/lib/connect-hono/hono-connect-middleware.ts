import type {
  ConnectRouter,
  ConnectRouterOptions,
  ContextValues,
} from '@connectrpc/connect'
import { Code, ConnectError, createConnectRouter } from '@connectrpc/connect'
import {
  compressionBrotli,
  compressionGzip,
  universalRequestFromNodeRequest,
  universalResponseToNodeResponse,
} from '@connectrpc/connect-node'
import type { UniversalHandler } from '@connectrpc/connect/protocol'
import type { Http2Bindings } from '@hono/node-server'
import type { HonoRequest, MiddlewareHandler } from 'hono'
import { createMiddleware } from 'hono/factory'

/**
 * Reference: https://github.com/connectrpc/connect-es/blob/main/packages/connect-express/src/express-connect-middleware.ts
 */
interface HonoConnectMiddlewareOptions extends ConnectRouterOptions {
  /**
   * Route definitions. We recommend the following pattern:
   *
   * Create a file `connect.ts` with a default export such as this:
   *
   * ```ts
   * import {ConnectRouter} from "@connectrpc/connect";
   *
   * export default (router: ConnectRouter) => {
   *   router.service(ElizaService, {});
   * }
   * ```
   *
   * Then pass this function here.
   */
  routes: (router: ConnectRouter) => void
  /**
   * Serve all handlers under this prefix. For example, the prefix "/something"
   * will serve the RPC foo.FooService/Bar under "/something/foo.FooService/Bar".
   * Note that many gRPC client implementations do not allow for prefixes.
   */
  requestPathPrefix?: string
  /**
   * Context values to extract from the request. These values are passed to
   * the handlers.
   */
  contextValues?: (req: HonoRequest) => ContextValues
}

/**
 * Adds your Connect RPCs to an Hono server.
 */
export function honoConnectMiddleware(
  options: HonoConnectMiddlewareOptions,
): MiddlewareHandler<{ Bindings: Http2Bindings }> {
  if (options.acceptCompression === undefined) {
    options.acceptCompression = [compressionGzip, compressionBrotli]
  }
  const router = createConnectRouter(options)
  options.routes(router)
  const prefix = options.requestPathPrefix ?? ''
  const paths = new Map<string, UniversalHandler>()
  for (const uHandler of router.handlers) {
    paths.set(prefix + uHandler.requestPath, uHandler)
  }

  return createMiddleware<{ Bindings: Http2Bindings }>(async (c, next) => {
    // Strip the query parameter when matching paths.
    const uHandler = paths.get(c.req.path)
    if (!uHandler) {
      return next()
    }

    const nodeReq = c.env.incoming
    const nodeRes = c.env.outgoing

    const uReq = universalRequestFromNodeRequest(
      nodeReq,
      undefined,
      options.contextValues?.(c.req),
    )
    try {
      const uRes = await uHandler(uReq)
      await universalResponseToNodeResponse(uRes, nodeRes)
    } catch (reason) {
      if (ConnectError.from(reason).code === Code.Aborted) {
        return
      }
      console.error(
        `handler for rpc ${uHandler.method.name} of ${uHandler.service.typeName} failed`,
        reason,
      )
    }

    await next()
  })
}
