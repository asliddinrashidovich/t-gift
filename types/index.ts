/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GiftStatus = 'pending' | 'approved' | 'rejected' | 'activated';

export interface Tariff {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  duration_months: number;
  period_months: number;
  created_at: number;
  is_active: boolean;
}
export interface UserData {
  id: string;
  role: string;
  email: string;
  phone: string;
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
  }
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

export interface GiftApplication {
  id: string;
  userEmail: string;
  userName: string;
  tariffName: string;
  tariffId: string;
  tariff_id: string;
  appliedDate: string;
  status: GiftStatus;
  activationCode?: string;
  reason?: string;
  approvedDate?: string;
}

export interface TelegramConfig {
  botToken: string;
  isConnected: boolean;
  approverChatId: string;
  botUsername: string;
  lastSyncTime?: string;
}

export interface NotificationAuditLog {
  id: string;
  recipient: string;
  channel: 'Telegram' | 'Email';
  action: string;
  status: 'Sent' | 'Failed';
  timestamp: string;
  details: string;
}

export interface UserSession {
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin' | null;
  activeTariff: {
    name: string;
    expiresAt: string;
    daysRemaining: number;
    activationCodeUsed?: string;
  } | null;
}

export interface AppState {
  tariffs: Tariff[];
  giftApplications: GiftApplication[];
  telegramConfig: TelegramConfig;
  auditLogs: NotificationAuditLog[];
  session: UserSession;
}
