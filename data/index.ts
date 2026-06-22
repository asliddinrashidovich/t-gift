/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tariff, GiftApplication, NotificationAuditLog } from '../types';

export const initialTariffs: Tariff[] = [
  {
    id: 't-1',
    name: 'Developer Launchpad',
    price: 19,
    durationMonths: 1,
    isActive: true,
    features: [
      'Access to standard channels',
      'API rate limit: 10,000 req/mo',
      'Community priority support',
      'Weekly automated usage reports',
      '1 active webhook integrations'
    ]
  },
  {
    id: 't-2',
    name: 'Startup Scale Accelerator',
    price: 49,
    durationMonths: 3,
    isActive: true,
    features: [
      'Access to premium + alpha channels',
      'API rate limit: 100,000 req/mo',
      '24/7 dedicated chat support',
      'Daily granular usage dashboard',
      'Unlimited webhook actions',
      'Custom SLA agreement limits'
    ]
  },
  {
    id: 't-3',
    name: 'Enterprise Unified Plus',
    price: 149,
    durationMonths: 12,
    isActive: true,
    features: [
      'Full unrestricted global access',
      'Uncapped API rate limits',
      '1-on-1 dedicated engineer channel',
      'Real-time Telegram integration stream',
      'Pre-approved gift codes allowance',
      'Custom security & SSO options'
    ]
  },
  {
    id: 't-4',
    name: 'Academic Research Elite',
    price: 29,
    durationMonths: 6,
    isActive: false,
    features: [
      'Full academic study repository access',
      'Standard support tier',
      '50,000 academic API credits/mo',
      'Shared researcher workflow tools'
    ]
  }
];

export const initialGiftApplications: GiftApplication[] = [
  {
    id: 'g-1',
    userEmail: 'asliddinrashidovich7@gmail.com',
    userName: 'Asliddin Rashidovich',
    tariffName: 'Startup Scale Accelerator',
    tariffId: 't-2',
    appliedDate: '2026-06-18',
    status: 'Activated',
    activationCode: 'STARTUP-A87F-X90B',
    reason: 'Evaluating the platform workflow for managing regional logistics data channels.',
    approvedDate: '2026-06-19'
  },
  {
    id: 'g-2',
    userEmail: 'sarah.jennings@vercel-labs.com',
    userName: 'Sarah Jennings',
    tariffName: 'Enterprise Unified Plus',
    tariffId: 't-3',
    appliedDate: '2026-06-19',
    status: 'Approved',
    activationCode: 'ENTERPRISE-Q992-K54F',
    reason: 'To establish unified Slack and Telegram telemetry alert pipelines for dev-center nodes.',
    approvedDate: '2026-06-20'
  },
  {
    id: 'g-3',
    userEmail: 'marcus.vance@tech-startups.io',
    userName: 'Marcus Vance',
    tariffName: 'Developer Launchpad',
    tariffId: 't-1',
    appliedDate: '2026-06-20',
    status: 'Pending',
    reason: 'Requesting the launchpad tariff to verify Webhook reliability with local microservices.'
  },
  {
    id: 'g-4',
    userEmail: 'elena.rodriguez@edu-research.xyz',
    userName: 'Elena Rodriguez',
    tariffName: 'Academic Research Elite',
    tariffId: 't-4',
    appliedDate: '2026-06-15',
    status: 'Rejected',
    reason: 'Applying for research elite access but provided an invalid institution domain validation token.'
  }
];

export const initialAuditLogs: NotificationAuditLog[] = [
  {
    id: 'log-1',
    recipient: '@tariff_gift_approver_bot',
    channel: 'Telegram',
    action: 'New Application Notification',
    status: 'Sent',
    timestamp: '2026-06-20 09:12:44',
    details: 'Dispatched notification for Marcus Vance (Developer Launchpad)'
  },
  {
    id: 'log-2',
    recipient: 'sarah.jennings@vercel-labs.com',
    channel: 'Email',
    action: 'Gift Request Approved Alert',
    status: 'Sent',
    timestamp: '2026-06-20 08:30:15',
    details: 'Dispatched activation code [ENTERPRISE-Q992-K54F] with instruction manuals'
  },
  {
    id: 'log-3',
    recipient: '@tariff_gift_approver_bot',
    channel: 'Telegram',
    action: 'Application Approved Inline Action',
    status: 'Sent',
    timestamp: '2026-06-20 08:30:12',
    details: 'Admin user approved id [g-2] via interactive Telegram inline callback'
  },
  {
    id: 'log-4',
    recipient: 'elena.rodriguez@edu-research.xyz',
    channel: 'Email',
    action: 'Gift Request Rejection Notice',
    status: 'Sent',
    timestamp: '2026-06-15 14:02:11',
    details: 'Dispatched status explanation: Provided invalid domain documentation credentials.'
  },
  {
    id: 'log-5',
    recipient: '@tariff_gift_delivery_channel',
    channel: 'Telegram',
    action: 'Bot Connection Validation Handshake',
    status: 'Failed',
    timestamp: '2026-06-10 11:30:00',
    details: 'Dispatched handshake check but endpoint returned HTTP 403 Forbidden (Token revoked)'
  }
];
