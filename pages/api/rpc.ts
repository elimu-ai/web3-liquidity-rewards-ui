import type { NextApiRequest, NextApiResponse } from 'next'

const RPC_URL = process.env.RPC_URL
const ALLOWED_METHODS = new Set([
  'eth_call',
  'eth_blockNumber',
  'eth_chainId'
])

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!RPC_URL) {
    return res.status(500).json({ error: 'RPC_URL is not configured' })
  }

  const body = req.body
  const requests = Array.isArray(body) ? body : [body]
  const invalidMethod = requests.find((item) => {
    const method = item?.method
    return !method || !ALLOWED_METHODS.has(method)
  })

  if (!body || !requests.length) {
    return res.status(400).json({ error: 'Invalid JSON-RPC payload' })
  }

  if (invalidMethod) {
    const method = invalidMethod?.method || 'unknown'
    return res.status(403).json({ error: `RPC method not allowed: ${method}` })
  }

  try {
    const upstream = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const text = await upstream.text()
    res.status(upstream.status)
    res.setHeader('Content-Type', upstream.headers.get('Content-Type') || 'application/json')
    return res.send(text)
  } catch (error) {
    return res.status(502).json({ error: 'Upstream RPC request failed' })
  }
}
