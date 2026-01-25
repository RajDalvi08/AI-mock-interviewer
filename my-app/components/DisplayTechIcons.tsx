import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { mappings } from '@/constants/index.ts'

interface TechIconProps {
  techStack: string[]
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"

// Normalize tech name for URL
const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "")
  return mappings[key as keyof typeof mappings] || "tech"
}

// Generate tech icon URLs synchronously
const getTechIconsSync = (techStack: string[]) => {
  return techStack.map((tech) => ({
    tech,
    url: `${techIconBaseURL}/${normalizeTechName(tech)}/${normalizeTechName(tech)}-original.svg`,
  }))
}

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const techIcons = getTechIconsSync(techStack)

  return (
    <div className="flex items-center">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            'rounded-full p-1 flex items-center justify-center bg-dark-300 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-110',
            index > 0 && '-ml-3'
          )}
        >
          <Image
            src={url}
            alt={tech}
            width={30}
            height={30}
            className="w-6 h-6 object-contain"
          />
        </div>
      ))}

      {/* If more than 3 techs, show +X */}
      {techStack.length > 3 && (
        <div className="flex items-center justify-center -ml-3 w-6 h-6 rounded-full bg-gray-700 text-white text-[10px] font-semibold shadow-md">
          +{techStack.length - 3}
        </div>
      )}
    </div>
  )
}

export default DisplayTechIcons
