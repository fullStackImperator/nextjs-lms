import React from 'react'


interface MaterilaProps {
  material: string | null
}


export const Material = ({ material }: MaterilaProps) => {
  return (
    <section className="w-full flex justify-center py-10">
      <div className="w-10/12 md:w-8/12">
        <h3 className="text-lg md:text-2xl font-semibold mb-3">
          Benötigtes Material
        </h3>

        <h5 className="text-sm md:text-lg ">{material}</h5>
      </div>
    </section>
  )
}
