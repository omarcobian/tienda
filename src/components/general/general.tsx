'use client'

export default function General({data,children}: {data: {message: string, }, children?: React.ReactNode}) {
  return (
    <div>
        {children}
        <h1>{data.message}</h1>
    </div>
  )
}
