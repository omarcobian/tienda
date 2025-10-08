import Link from 'next/link'
 
export default async function NotFound() {

  return (
    <div>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/blog">all posts</Link>
      </p>
    </div>
  )
}