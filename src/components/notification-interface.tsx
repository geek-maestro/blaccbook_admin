import { type ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { Calendar, X, MessageCircle, Phone, Settings} from "lucide-react"
import Sidebar from "@/components/Sidebar";
// Types
export interface NotificationItem {
  id: string
  type: "booking" | "booking-cancelled" | "message" | "call" | "system"
  title: string
  description: string
  time: string
  actionLabel: string
  actionVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  actionColor?: string
}

interface NotificationTabProps {
  label: string
  active?: boolean
  onClick: () => void
}

interface NotificationCardProps {
  notification: NotificationItem
  onClick: (id: string) => void
}

// Mock data
const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "booking",
    title: "New Booking",
    description: "Augustine has booked the service for Apr 10, 2025 at 12:00pm",
    time: "5 mins ago",
    actionLabel: "View",
    actionVariant: "default",
  },
  {
    id: "2",
    type: "booking-cancelled",
    title: "Booking Cancelled",
    description: "Augustine has booked the service for Apr 10, 2025 at 12:00pm",
    time: "2 hours ago",
    actionLabel: "View2",
    actionVariant: "destructive",
  },
  {
    id: "3",
    type: "message",
    title: "New messages",
    description: "Augustine has booked the service for Apr 10, 2025 at 12:00pm",
    time: "15 mins ago",
    actionLabel: "Reply",
    actionVariant: "outline",
  },
  {
    id: "4",
    type: "call",
    title: "New messages",
    description: "Augustine has booked the service for Apr 10, 2025 at 12:00pm",
    time: "15 mins ago",
    actionLabel: "Call Back",
    actionVariant: "secondary",
  },
  {
    id: "5",
    type: "system",
    title: "New messages",
    description: "Augustine has booked the service for Apr 10, 2025 at 12:00pm",
    time: "30 mins ago",
    actionLabel: "Details",
    actionVariant: "link",
  },
]

type FilterType = "all" | "bookings" | "chats" | "systems" | "calls"

// Components
const NotificationTab = ({ label, active, onClick }: NotificationTabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-8 py-3 rounded-full text-base font-medium transition-colors",
        active ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
      )}
    >
      {label}
    </button>
  )
}

const NotificationCard = ({ notification, onClick }: NotificationCardProps) => {
  const getIcon = (): ReactNode => {
    const iconSize = 24
    const iconClasses = "text-white"

    switch (notification.type) {
      case "booking":
        return (
          <div className="p-4 bg-green-200 rounded-full">
            <Calendar size={iconSize} className="text-green-500" />
          </div>
        )
      case "booking-cancelled":
        return (
          <div className="p-4 bg-red-200 rounded-full">
            <X size={iconSize} className="text-red-500" />
          </div>
        )
      case "message":
        return (
          <div className="p-4 bg-blue-200 rounded-full">
            <MessageCircle size={iconSize} className="text-blue-500" />
          </div>
        )
      case "call":
        return (
          <div className="p-4 bg-yellow-200 rounded-full">
            <Phone size={iconSize} className="text-yellow-500" />
          </div>
        )
      case "system":
        return (
          <div className="p-4 bg-blue-900 rounded-full">
            <Settings size={iconSize} className={iconClasses} />
          </div>
        )
      default:
        return (
          <div className="p-4 bg-gray-200 rounded-full">
            <MessageCircle size={iconSize} className="text-gray-500" />
          </div>
        )
    }
  }

  const getActionButton = () => {
    const baseClasses = "px-5 py-1 rounded-full text-white font-medium"

    let buttonClasses = baseClasses

    switch (notification.actionLabel.toLowerCase()) {
      case "view":
        buttonClasses = cn(baseClasses, "bg-green-500 hover:bg-green-600")
        break
        case "view2":
        buttonClasses = cn(baseClasses, "bg-red-500 hover:bg-red-600")
        break
      case "reply":
        buttonClasses = cn(baseClasses, "bg-blue-500 hover:bg-blue-600")
        break
      case "call back":
        buttonClasses = cn(baseClasses, "bg-orange-400 hover:bg-orange-500")
        break
      case "details":
        buttonClasses = cn(baseClasses, "bg-blue-900 hover:bg-blue-950")
        break
      default:
        buttonClasses = cn(baseClasses, "bg-gray-500 hover:bg-gray-600")
    }

    return (
      <button className={buttonClasses} onClick={() => onClick(notification.id)}>
        {notification.actionLabel}
      </button>
    )
  }

  return (
    <div className="flex items-center px-4 py-6 border-b border-gray-200">
      <div className="mr-4">{getIcon()}</div>
      <div className="flex-1">
        <h3 className="mb-1 text-xl font-bold">{notification.title}</h3>
        <p className="text-gray-500">{notification.description}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-gray-500">{notification.time}</span>
        {getActionButton()}
      </div>
    </div>
  )
}


export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const handleNotificationAction = (id: string) => {
    console.log(`Action clicked for notification ${id}`)
    // Handle notification action (e.g., navigate to details, open modal, etc.)
  }

  const filterNotifications = (notifications: NotificationItem[], filter: FilterType) => {
    if (filter === "all") return notifications

    const filterMap: Record<FilterType, string[]> = {
      all: [],
      bookings: ["booking", "booking-cancelled"],
      chats: ["message"],
      systems: ["system"],
      calls: ["call"],
    }

    return notifications.filter((notification) => filterMap[filter].includes(notification.type))
  }

  const filteredNotifications = filterNotifications(mockNotifications, activeFilter)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 py-6 overflow-y-auto">
        {/* Page header with icon */}
        <div className="flex items-center pl-6 justify-between py-2 mb-3 border-b-2 border-gray-400">
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
          <div className="w-auto px-6 overflow-hidden">
            {/* Main content */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">All Notifications</h2>
                  <span className="text-sm text-gray-500">{filteredNotifications.length} notifications</span>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex justify-center gap-2 p-4 overflow-x-auto border-b border-gray-100">
                <NotificationTab label="All" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
                <NotificationTab
                  label="Bookings"
                  active={activeFilter === "bookings"}
                  onClick={() => setActiveFilter("bookings")}
                />
                <NotificationTab label="Chats" active={activeFilter === "chats"} onClick={() => setActiveFilter("chats")} />
                <NotificationTab
                  label="Systems"
                  active={activeFilter === "systems"}
                  onClick={() => setActiveFilter("systems")}
                />
                <NotificationTab label="Calls" active={activeFilter === "calls"} onClick={() => setActiveFilter("calls")} />
              </div>

              {/* Notification list */}
              <div>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onClick={handleNotificationAction}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">No notifications found</div>
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

