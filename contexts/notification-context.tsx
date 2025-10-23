"use client";
import { createContext } from "react";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { NotificationType } from "@/provider/notification-provider";

interface NotificationContextType {
  api: NotificationInstance;
  openNotificationWithIcon: (
    type: NotificationType,
    title: string,
    message: string
  ) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
