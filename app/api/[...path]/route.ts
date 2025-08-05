import { NextRequest, NextResponse } from 'next/server'
import { buildUrl } from '@/lib/apiFetch'


type ALLOWED_METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

async function handler(method: ALLOWED_METHODS, req: NextRequest, params: Promise<{ path: string[] }>) {
  const { path } = await params
  const query = req.nextUrl.search
  let targetUrl = await buildUrl(path.join('/'), true)
  targetUrl = `${targetUrl}${query}`

  const headers = new Headers(req.headers)
  headers.delete('host')
  headers.delete('connection')
  headers.delete('content-length')
  headers.delete('accept-encoding')

  const body = method === 'GET' || method === 'HEAD' ? undefined : req.body

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      ...(body && { duplex: 'half' }),
    })

    const proxyHeaders = new Headers(response.headers)
    proxyHeaders.delete('content-length')
    proxyHeaders.delete('content-encoding')
    proxyHeaders.delete('transfer-encoding')
    proxyHeaders.delete('connection')
    proxyHeaders.delete('keep-alive')
    proxyHeaders.delete('server')
    proxyHeaders.delete('x-powered-by')

    const buffer = Buffer.from(await response.arrayBuffer())

    return new NextResponse(buffer, {
      status: response.status,
      headers: proxyHeaders,
    })
  } catch (e) {
    console.error('Proxy error:', e)
    return NextResponse.json({
      error: 'Proxy failed',
      details: e instanceof Error ? e.message : String(e),
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler('GET', req, context.params)
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler('POST', req, context.params)
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler('PUT', req, context.params)
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler('PATCH', req, context.params)
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler('DELETE', req, context.params)
}
