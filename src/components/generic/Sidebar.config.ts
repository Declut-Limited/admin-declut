import type { IconType } from 'react-icons'
import { GoHome } from 'react-icons/go'

import profileIcon from '@/assets/icons/profile-2user.svg'
import tagIcon from '@/assets/icons/tag.svg'
import categoriesIcon from '@/assets/icons/categories.svg'
import starIcon from '@/assets/icons/star.svg'
import moneySendIcon from '@/assets/icons/money-send.svg'
import lockIcon from '@/assets/icons/lock.svg'
// import infoCircleIcon from '@/assets/icons/info-circle.svg'
// import moneysIcon from '@/assets/icons/moneys.svg'
import documentTextIcon from '@/assets/icons/document-text.svg'
import layerIcon from '@/assets/icons/layer.svg'
// import ticketDiscountIcon from '@/assets/icons/ticket-discount.svg'
import notificationBingIcon from '@/assets/icons/notification-bing.svg'
// import chartIcon from '@/assets/icons/chart-2.svg'
import textIcon from '@/assets/icons/text.svg'
import setting2Icon from '@/assets/icons/setting-2.svg'
import giftIcon from '@/assets/icons/gift.svg'
import profileAdd from '@/assets/icons/profile-add.svg'
// import setting4Icon from '@/assets/icons/setting-4.svg'

export interface NavItem {
  label: string
  path: string
  icon: IconType | string  
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export type PermissionModule =
  | 'dashboard'
  | 'users'
  | 'listings'
  | 'categories'
  | 'reviews'
  | 'transactions'
  | 'reports'
  | 'activity'
  | 'content'
  | 'notifications'
  | 'promotion'
  | 'referrals'
  | 'waitlist'
  | 'settings'
  | 'roles'

export interface NavItem {
  label: string
  path: string
  icon: IconType | string
  module?: PermissionModule
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: GoHome, module: 'dashboard' },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { label: 'Users', path: '/users', icon: profileIcon, module: 'users' },
      { label: 'Listings', path: '/listings', icon: tagIcon, module: 'listings' },
      { label: 'Categories', path: '/categories', icon: categoriesIcon, module: 'categories' },
      { label: 'Reviews', path: '/reviews', icon: starIcon, module: 'reviews' },
    ],
  },
  {
    label: 'Money',
    items: [
      { label: 'Transactions', path: '/transactions', icon: moneySendIcon, module: 'transactions' },
      // TODO: no `escrow` permission key in the API
      { label: 'Escrow', path: '/escrows', icon: lockIcon },
    ],
  },
  {
    label: 'Trust & Safety',
    items: [
      { label: 'Disputes', path: '/disputes', icon: documentTextIcon, module: 'reports' },
      { label: 'Activity Logs', path: '/activity-logs', icon: layerIcon, module: 'activity' },
    ],
  },
  {
    label: 'Growth',
    items: [
      // TODO: no `promotions` or `referrals` permission key in the API
      // { label: 'Promotions', path: '/promotions', icon: ticketDiscountIcon },
      { label: 'Notifications', path: '/notifications', icon: notificationBingIcon, module: 'notifications' },
      { label: 'Content', path: '/content', icon: textIcon, module: 'content' },
      { label: 'Referrals', path: '/referrals', icon: giftIcon },
      { label: 'Waitlist', path: '/waitlist', icon: profileAdd },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Settings', path: '/settings', icon: setting2Icon, module: 'settings' },
    ],
  },
]