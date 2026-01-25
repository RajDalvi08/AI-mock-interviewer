import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';

interface InterviewCardProps {
  interviewId: string;
  userId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

const InterviewCard = ({
  interviewId,
  userId,
  role,
  level,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null; // Replace with actual feedback fetching logic
  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-[300px] relative overflow-hidden rounded-2xl border border-white/10 shadow-lg p-4 bg-gradient-to-b from-[#2b2b2b] to-[#1f1f1f] flex flex-col justify-between">
      
      {/* TOP BADGE */}
      <div className="absolute top-0 right-0 bg-light-600 px-4 py-2 rounded-bl-lg z-10">
        <p className="badge-text">{normalizedType}</p>
      </div>

      {/* IMAGE */}
      <div className="flex justify-center my-4">
        <Image
          src={getRandomInterviewCover()}
          alt="cover image"
          width={90}
          height={90}
          className="rounded-full object-cover"
        />
      </div>

      {/* INFO */}
      <div className="mt-2 flex flex-col gap-3">
        <h3 className="text-white font-semibold text-lg">{role}</h3>

        {/* Date and Score */}
        <div className='flex flex-row gap-5'>
          <div className='flex flex-row gap-2 items-center'>
            <Image src='/calendar.svg' alt="calendar" width={20} height={20} />
            <p className="text-gray-400 text-sm">{formattedDate}</p>
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <Image src='/star.svg' alt="star" width={20} height={20} />
            <p className="text-gray-400 text-sm">{feedback?.totalScore || '---'}/100</p>
          </div>
        </div>

        {/* Feedback / Placeholder */}
        <p className='line-clamp-2 text-gray-300 text-sm mt-2'>
          {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
        </p>

        {/* Tech Icons + Button */}
        <div className="flex flex-row justify-between items-center mt-3">
          <DisplayTechIcons techStack={techstack} />
          <Button className='btn-primary'>
            <Link href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}>
              {feedback ? 'Check Feedback' : 'View Interview'}
            </Link>
          </Button>
        </div>

        {/* Level and Tech Stack */}
        <div className='flex flex-row flex-wrap gap-2 mt-2'>
          <p className="text-gray-400 text-sm font-semibold">{level}</p>
          <p className="text-gray-400 text-sm font-semibold">• {techstack.join(', ')}</p>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard;
