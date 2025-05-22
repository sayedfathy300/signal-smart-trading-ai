
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  LineChart, 
  Search, 
  ArrowUpDown, 
  PieChart, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppSidebarProps {
  lang: 'en' | 'ar';
}

const getSidebarItems = (lang: 'en' | 'ar') => [
  {
    id: 'dashboard',
    title: lang === 'en' ? 'Dashboard' : 'لوحة التحكم',
    icon: LayoutDashboard,
    path: '/'
  },
  {
    id: 'charts',
    title: lang === 'en' ? 'Charts' : 'الرسومات البيانية',
    icon: LineChart,
    path: '/charts'
  },
  {
    id: 'analysis',
    title: lang === 'en' ? 'Analysis' : 'التحليل',
    icon: Search,
    path: '/analysis'
  },
  {
    id: 'trading',
    title: lang === 'en' ? 'Trading' : 'التداول',
    icon: ArrowUpDown,
    path: '/trading'
  },
  {
    id: 'portfolio',
    title: lang === 'en' ? 'Portfolio' : 'المحفظة',
    icon: PieChart,
    path: '/portfolio'
  }
];

const getSettingsItems = (lang: 'en' | 'ar') => [
  {
    id: 'settings',
    title: lang === 'en' ? 'Settings' : 'الإعدادات',
    icon: Settings,
    path: '/settings'
  },
  {
    id: 'help',
    title: lang === 'en' ? 'Help' : 'المساعدة',
    icon: HelpCircle,
    path: '/help'
  },
  {
    id: 'logout',
    title: lang === 'en' ? 'Logout' : 'تسجيل الخروج',
    icon: LogOut,
    path: '/logout'
  }
];

export function AppSidebar({ lang }: AppSidebarProps) {
  const isMobile = useIsMobile();
  const sidebarItems = getSidebarItems(lang);
  const settingsItems = getSettingsItems(lang);
  
  return (
    <>
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-50">
          <SidebarTrigger />
        </div>
      )}
      <Sidebar className="border-r border-border">
        <SidebarContent>
          <div className="flex items-center justify-center py-6">
            <span className="text-2xl font-bold text-trading-primary">
              Signal <span className="font-light">Black</span>
            </span>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className={cn(lang === 'ar' && 'rtl')}>
              {lang === 'en' ? 'Navigation' : 'التنقل'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path}
                        className={cn("flex items-center gap-2", lang === 'ar' && 'rtl justify-end')}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className={cn(lang === 'ar' && 'rtl')}>
              {lang === 'en' ? 'Account' : 'الحساب'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path}
                        className={cn("flex items-center gap-2", lang === 'ar' && 'rtl justify-end')}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
