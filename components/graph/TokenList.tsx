'use client'

import { useEffect, useState } from 'react'
import { getTokens } from '../../utils/queries'
import { Token } from '../../types/graph'

export default function TokenList() {
    const [tokens, setTokens] = useState<Token[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                setLoading(true)
                const data = await getTokens({ first: 10 })
                setTokens(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : '获取数据失败')
            } finally {
                setLoading(false)
            }
        }

        fetchTokens()
    }, [])

    if (loading) return <div>加载中...</div>
    if (error) return <div>错误: {error}</div>

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">代币列表</h2>
            {tokens.map((token) => (
                <div key={token.id} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">{token.name} ({token.symbol})</h3>
                    <p>地址: {token.id}</p>
                    <p>创建者: {token.creator}</p>
                    <p>创建时间: {new Date(parseInt(token.createdAt) * 1000).toLocaleString()}</p>
                </div>
            ))}
        </div>
    )
}