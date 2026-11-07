import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  UserCircle,
  LogOut,
  Settings,
  Sun,
  Moon,
  CheckCheck,
  Trash2,
  ChevronDown,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications
} from "../../services/notificationService";

function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(
    getNotifications
  );

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(getNotifications());
    };

    window.addEventListener(
      "compilex-notifications-updated",
      updateNotifications
    );

    window.addEventListener("storage", updateNotifications);

    return () => {
      window.removeEventListener(
        "compilex-notifications-updated",
        updateNotifications
      );

      window.removeEventListener(
        "storage",
        updateNotifications
      );
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate("/login", { replace: true });
  };

  const openSettings = () => {
    setShowProfile(false);
    navigate("/settings");
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    setNotifications(getNotifications());
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  };

  const handleClearNotifications = () => {
    clearNotifications();
    setNotifications([]);
  };

  const formatTime = (date) => {
  const difference =
    new Date().getTime() - new Date(date).getTime();

  if (difference < 60000) return "Just now";

  if (difference < 3600000) {
    return `${Math.floor(difference / 60000)} min ago`;
  }

  if (difference < 86400000) {
    return `${Math.floor(difference / 3600000)} hr ago`;
  }

  return new Date(date).toLocaleDateString();
};

  const getNotificationIcon = (type) => {
    if (type === "success") {
      return <CheckCircle size={17} className="text-emerald-500" />;
    }

    if (type === "error") {
      return <AlertCircle size={17} className="text-red-500" />;
    }

    return <Info size={17} className="text-cyan-500" />;
  };

  return (
    <header className="relative z-30 flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-8">

      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Compiler Dashboard
        </h2>

        <p className="text-xs text-[var(--text-muted)]">
          Manage and analyze your programs
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          aria-label="Toggle theme"
          className="rounded-lg p-2.5 text-[var(--text-secondary)] transition hover:bg-[var(--hover)] hover:text-cyan-500"
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>

          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className="relative rounded-lg p-2.5 text-[var(--text-secondary)] transition hover:bg-[var(--hover)] hover:text-cyan-500"
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:w-96">

              {/* Notification Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    Notifications
                  </h3>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {unreadCount} unread notifications
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  title="Mark all as read"
                  className="rounded-lg p-2 text-cyan-500 transition hover:bg-[var(--hover)] disabled:opacity-40"
                >
                  <CheckCheck size={18} />
                </button>

              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 ? (
                  <div className="px-5 py-10 text-center">

                    <Bell
                      size={30}
                      className="mx-auto mb-3 text-[var(--text-muted)]"
                    />

                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Your compiler activity will appear here.
                    </p>

                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className={`flex w-full gap-3 border-b border-[var(--border)] p-4 text-left transition hover:bg-[var(--hover)] ${
                        !notification.read
                          ? "bg-cyan-500/5"
                          : ""
                      }`}
                    >

                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-2">

                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                          )}

                        </div>

                        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                          {formatTime(notification.createdAt)}
                        </p>

                      </div>

                    </button>
                  ))
                )}

              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-[var(--border)] p-3">

                  <button
                    type="button"
                    onClick={handleClearNotifications}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                    Clear all notifications
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Profile Menu */}
        <div
          className="relative border-l border-[var(--border)] pl-4"
          ref={profileRef}
        >

          <button
            type="button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            aria-expanded={showProfile}
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-[var(--hover)]"
          >

            <UserCircle size={30} className="text-cyan-500" />

            <div className="hidden text-left sm:block">

              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-[var(--text-muted)]">
                {user?.role || "VIEWER"}
              </p>

            </div>

            <ChevronDown
              size={15}
              className="text-[var(--text-muted)]"
            />

          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">

              {/* User Details */}
              <div className="border-b border-[var(--border)] p-4">

                <p className="font-semibold text-[var(--text-primary)]">
                  {user?.name || "User"}
                </p>

                <p className="mt-1 break-all text-xs text-[var(--text-muted)]">
                  {user?.email || "No email available"}
                </p>

                <span className="mt-3 inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-500">
                  {user?.role || "VIEWER"}
                </span>

              </div>

              <div className="p-2">

                <button
                  type="button"
                  onClick={openSettings}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--hover)] hover:text-[var(--text-primary)]"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-500 transition hover:bg-red-500/10"
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Header;