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
import ticketDiscountIcon from '@/assets/icons/ticket-discount.svg'
import notificationBingIcon from '@/assets/icons/notification-bing.svg'
// import chartIcon from '@/assets/icons/chart-2.svg'
import textIcon from '@/assets/icons/text.svg'
import setting2Icon from '@/assets/icons/setting-2.svg'
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

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/dashboard', icon: GoHome }],
  },
  {
    label: 'Marketplace',
    items: [
      { label: 'Users', path: '/users', icon: profileIcon },
      { label: 'Listings', path: '/listings', icon: tagIcon },
      { label: 'Categories', path: '/categories', icon: categoriesIcon },
      { label: 'Reviews', path: '/reviews', icon: starIcon },
    ],
  },
  {
    label: 'Money',
    items: [
      { label: 'Transactions', path: '/transactions', icon: moneySendIcon },
      { label: 'Escrow', path: '/escrows', icon: lockIcon },
      // { label: 'Disputes', path: '/money-disputes', icon: infoCircleIcon },
      // { label: 'Finance', path: '/finance', icon: moneysIcon },
    ],
  },
  {
    label: 'Trust & Safety',
    items: [
      { label: 'Disputes', path: '/disputes', icon: documentTextIcon },
      { label: 'Activity Logs', path: '/activity-logs', icon: layerIcon },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Promotions', path: '/promotions', icon: ticketDiscountIcon },
      { label: 'Notifications', path: '/notifications', icon: notificationBingIcon },
      // { label: 'Analytics', path: '/analytics', icon: chartIcon },
      { label: 'Content', path: '/content', icon: textIcon },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Settings', path: '/settings', icon: setting2Icon },
      // { label: 'System Configuration', path: '/system-configuration', icon: setting4Icon },
    ],
  },
]