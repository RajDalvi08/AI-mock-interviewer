import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface AgentProps {
  userName: string;
}

const Agent = ({ userName }: AgentProps) => {
  const isSpeaking = true;
  const callStatus = CallStatus.INACTIVE; // replace with real state
  const messages = [
    'Whats your name?',
    'My name is John Doe, nice to meet you!'
  ]
  const lastMessage = messages[messages.length - 1];
  return (
    <>
      <div className="call-view">
        {/* AI INTERVIEWER */}
        <div className="card-interviewer">
          <div className="avatar relative">
            <Image
              src="/ai-avatar.png"
              alt="AI interviewer"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* USER */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className='transcript-border'>
            <div className="transcript">
                <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>{lastMessage}</p>
            </div>
        </div>
      )}

      {/* CALL CONTROLS */}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="btn-call relative overflow-hidden">
            {/* ping effect ONLY while connecting */}
            {callStatus === CallStatus.CONNECTING && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/40" />
            )}

            {/* button label */}
            <span className="relative z-10 ">
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? 'Call'
                : 'Connecting...'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
