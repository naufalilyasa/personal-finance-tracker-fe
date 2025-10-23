"use client";
import React from "react";
import { notification } from "antd";
import { NotificationContext } from "@/contexts/notification-context";

export type NotificationType = "success" | "info" | "warning" | "error";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  return (
    <NotificationContext.Provider value={{ api, openNotificationWithIcon }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
