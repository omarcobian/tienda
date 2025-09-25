'use client'

export default function General({data}: {data: {message: string, }}) {
  return (
    <div>
        <h1>{data.message}</h1>

    </div>
  )
}
