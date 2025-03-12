import { useState, useEffect } from "react"

import Sidebar from "@/components/Sidebar"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Image, Send, Menu, X } from "lucide-react"

// AvatarWithInitials component
interface AvatarWithInitialsProps {
  initials: string
  color: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function AvatarWithInitials({ initials, color, size = "md", className }: AvatarWithInitialsProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-xl",
  }

  return (
    <Avatar
      className={`${sizeClasses[size]} ${color} text-white shadow-sm flex items-center justify-center ${className}`}
    >
      <div className="font-medium">{initials}</div>
    </Avatar>
  )
}

//Chat data Types
type Message = {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
}

type Conversation = {
  id: string
  contact: Contact
  messages: Message[]
  lastMessage: string
  lastMessageTime: Date
  unreadCount?: number
}

type Contact = {
  id: string
  name: string
  initials: string
  avatarColor: string
}

// Sample data
const contacts: Contact[] = [
  {
    id: "1",
    name: "Augustine Creative",
    initials: "AC",
    avatarColor: "bg-blue-500",
  },
  {
    id: "2",
    name: "Augustine C.",
    initials: "AC",
    avatarColor: "bg-blue-500",
  },
  {
    id: "3",
    name: "Ofosu David",
    initials: "OD",
    avatarColor: "bg-yellow-500",
  },
  {
    id: "4",
    name: "Owusu Gyamfi",
    initials: "OG",
    avatarColor: "bg-green-900",
  },
  {
    id: "5",
    name: "Simon Onam",
    initials: "SO",
    avatarColor: "bg-red-200",
  },
]

const conversations: Conversation[] = [
  {
    id: "1",
    contact: contacts[1],
    lastMessage: "Hello, is my appoint....",
    lastMessageTime: new Date("2025-03-12T11:31:00"),
    unreadCount: 3,
    messages: [
      {
        id: "m1",
        content: "Hello, I'm wondering if my appointment for morrow is still confirm",
        sender: "user",
        timestamp: new Date("2025-03-12T11:32:00"),
      },
      {
        id: "m2",
        content: "Hello, Augustine, yes your appointment is confirm morrow 2:10 pm",
        sender: "contact",
        timestamp: new Date("2025-03-12T11:33:00"),
      },
      {
        id: "m3",
        content: "Great 👍",
        sender: "user",
        timestamp: new Date("2025-03-12T11:34:00"),
      },
    ],
  },
  {
    id: "2",
    contact: contacts[2],
    lastMessage: "I'll like to reschedule...",
    lastMessageTime: new Date("2025-03-11"),
    messages: [],
  },
  {
    id: "3",
    contact: contacts[3],
    lastMessage: "Hello, is my appoint....",
    lastMessageTime: new Date("2025-03-04"),
    messages: [],
  },
  {
    id: "4",
    contact: contacts[4],
    lastMessage: "Hey Bob, been a while....",
    lastMessageTime: new Date("2025-03-05"),
    messages: [],
  },
]

export default function ChatInterface() {
  const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return formatTime(date)
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return `Mar ${date.getDate()}`
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // send this to an API
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b p-4  shadow-md z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold justify-start md:justify-end">Chat</h1>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden m-3">
          {/* Sidebar - with responsive behavior */}
          <div
            className={`
              ${isMobile ? "fixed inset-0 z-20 transition-transform duration-300 ease-in-out" : "relative w-96 border-r"} 
              ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
              bg-white shadow-lg
            `}
          >
            {/* Mobile sidebar header with close button */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-l font-bold">Recent Conversations</h3>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
            {/* Desktop */}
            <div className="p-4 h-full overflow-y-auto m-2 border-2 shadow-sm rounded-md">
              {!isMobile && <h3 className="mb-4 text-2xl font-bold">Recent Conversations</h3>}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search chat..." className="pl-10 rounded-full shadow-sm" />
              </div>

              {/* Conversation list */}
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left shadow-sm transition-colors ${
                      activeConversation.id === conversation.id ? "bg-blue-100" : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <AvatarWithInitials
                      initials={conversation.contact.initials}
                      color={conversation.contact.avatarColor}
                      size="md"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{conversation.contact.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="truncate text-muted-foreground">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white shadow-sm">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/30 z-10" onClick={toggleSidebar} />}

          {/* Chat area */}
          <div className="flex flex-1 flex-col border-2 shadow-lg rounded-xl">
            {/* Chat header */}
            <div className="flex items-center justify-between bg-white border-b p-4">
              <div className="flex items-center gap-3">
                <AvatarWithInitials
                  initials={activeConversation.contact.initials}
                  color={activeConversation.contact.avatarColor}
                  size="md"
                />
                <h2 className="text-xl font-semibold">{contacts[0].name}</h2>
              </div>
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm"
              >
                Clear chat
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-200">
              <div className="text-center text-sm text-muted-foreground">
                Today {formatTime(new Date("2025-03-12T11:32:00"))}
              </div>

              {activeConversation.messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 shadow-md ${
                      message.sender === "user" ? "bg-blue-100 text-foreground" : "bg-green-100 text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="border-t p-4 bg-white shadow-md">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here"
                    className="pr-10 shadow-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Image className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

