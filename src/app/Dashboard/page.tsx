import General from "@components/general/general"



export default async function page() {
  const res = await fetch('http://localhost:3000/api/admin')
  const data = await res.json()
  return (
    <div className="text-4xl text-cyan-600">datos generales
     <General data={data}>
      <h2 className="text-purple-800">
        esto es un children
      </h2>
     </General>

    </div>
  )
}
