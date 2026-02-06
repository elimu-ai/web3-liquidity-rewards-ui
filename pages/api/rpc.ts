import type { NextApiRequest, NextApiResponse } from 'next'

const RPC_URL = process.env.RPC_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!RPC_URL) {
    return res.status(500).json({ error: 'RPC_URL is not configured' })
  }

  try {
    const upstream = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })

    const text = await upstream.text()
    res.status(upstream.status)
    res.setHeader('Content-Type', upstream.headers.get('Content-Type') || 'application/json')
    return res.send(text)
  } catch (error) {
    return res.status(502).json({ error: 'Upstream RPC request failed' })
  }
}
