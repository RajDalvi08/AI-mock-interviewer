"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

// Enum for call status
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

// Message interface for transcript handling
interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

// Interface for Vapi Message events
interface VapiMessage {
  type: string;
  role: "user" | "system" | "assistant";
  transcriptType?: string;
  transcript: string;
}

// Props for Agent component
interface AgentProps {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId: string;
  type: "generate" | "custom";
  questions?: string[];
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();

  // State management
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handling API event subscriptions and message handling
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: VapiMessage) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    // --- FIXED ERROR HANDLING ---
    const onError = (error: any) => {
      // 1. Helper to safely extract the message string from various error shapes
      const getErrorMessage = (err: any): string => {
        // Case A: Standard JS Error (e.g., thrown exceptions)
        if (err?.message && typeof err.message === "string") {
          return err.message;
        }

        // Case B: Vapi Error Object (nested structure)
        const vapiMsg = err?.error?.message;
        if (typeof vapiMsg === "string") return vapiMsg;
        if (typeof vapiMsg === "object" && vapiMsg !== null) {
          return vapiMsg.msg || JSON.stringify(vapiMsg);
        }

        // Case C: String error
        if (typeof err === "string") return err;

        return "";
      };

      const extractedMessage = getErrorMessage(error);

      // 2. Ignore logic: Filter out technical disconnects/empty objects
      // "ejection" handles "Meeting ended due to ejection"
      // "Meeting has ended" handles standard Daily.co disconnects
      const ignorePatterns = ["Meeting has ended", "ejection", "call-end"];
      const shouldIgnore = ignorePatterns.some((pattern) => 
        extractedMessage.includes(pattern)
      );

      const isEmptyObject = !extractedMessage && (!error || Object.keys(error).length === 0);

      if (shouldIgnore || isEmptyObject) {
        console.log("Call session ended safely (ignored error):", extractedMessage);
        return;
      }

      // 3. Log real errors
      console.error("Vapi Error:", extractedMessage || error);
      
      // 4. Update UI
      setErrorMessage(
        extractedMessage || "Something went wrong. Please try again."
      );
    };

    // Subscribe to vapi events
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Cleanup on unmount
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    // Generate feedback when call finishes
    const handleGenerateFeedback = async (transcriptMessages: SavedMessage[]) => {
      setLoading(true);

      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: transcriptMessages,
          feedbackId,
        });

        if (success && id) {
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          setErrorMessage("Error saving feedback. Please try again.");
          router.push("/");
        }
      } catch (error) {
        setErrorMessage("Error generating feedback. Please try again.");
        console.error("Error generating feedback:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  // Function to start the call
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setErrorMessage(null);

    try {
      setLoading(true);
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions.map((question) => `- ${question}`).join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error: any) {
      // Check for specific start-up errors that we should ignore
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes("Meeting has ended") || errorMsg.includes("ejection")) {
        console.log("Call failed to start or ended immediately (ignored)");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      console.error("Error starting call:", error);
      setErrorMessage("Error starting the interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to disconnect the call
  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      {/* Error Message */}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI Avatar"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="User Avatar"
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* Transcript Area */}
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Call/Disconnect Button */}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="relative btn-call"
            onClick={handleCall}
            disabled={loading}
          >
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-6 h-6 border-4 border-t-4 border-gray-500 rounded-full animate-spin" />
              </div>
            )}
            <span>
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? "Call"
                : "..."}{" "}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;