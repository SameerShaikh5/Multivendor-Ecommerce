import React from 'react'

const CategoryCard = ({icon:Icon, name}) => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer
                hover:border-indigo-600 hover:shadow-md transition">
            <div className="bg-indigo-600/10 p-4 rounded-full mb-4">
                <Icon />

            </div>
            <span className="font-semibold text-gray-900">{name}</span>
        </div>
    )
}

export default CategoryCard