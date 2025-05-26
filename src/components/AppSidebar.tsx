
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
  LogOut,
  Bot,
  Brain,
  Cpu,
  Activity
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

const getAIItems = (lang: 'en' | 'ar') => [
  {
    id: 'ai-models',
    title: lang === 'en' ? 'AI Models' : 'نماذج الذكاء الاصطناعي',
    icon: Brain,
    path: '/ai-models'
  },
  {
    id: 'neural-networks',
    title: lang === 'en' ? 'Neural Networks' : 'الشبكات العصبية',
    icon: Cpu,
    path: '/neural-networks'
  },
  {
    id: 'trading-bot',
    title: lang === 'en' ? 'Trading Bot' : 'بوت التداول',
    icon: Bot,
    path: '/trading-bot'
  },
  {
    id: 'market-prediction',
    title: lang === 'en' ? 'Market Prediction' : 'توقع السوق',
    icon: Activity,
    path: '/market-prediction'
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
  const aiItems = getAIItems(lang);
  const settingsItems = getSettingsItems(lang);
  
  return (
    <>
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-50">
          <SidebarTrigger />
        </div>
      )}
      <Sidebar className="border-r border-gray-800 bg-trading-dark">
        <SidebarContent className="bg-trading-dark">
          <div className="flex items-center justify-center py-6 signal-black-gradient">
            <span className="text-2xl font-bold">
              <span className="text-white">Signal</span>{' '}
              <span className="text-trading-accent">Black</span>
            </span>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className={cn("text-gray-400", lang === 'ar' && 'rtl')}>
              {lang === 'en' ? 'Navigation' : 'التنقل'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 text-white hover:bg-trading-secondary hover:text-trading-up transition-colors",
                          lang === 'ar' && 'rtl justify-end'
                        )}
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

          <SidebarGroup>
            <SidebarGroupLabel className={cn("text-gray-400", lang === 'ar' && 'rtl')}>
              {lang === 'en' ? 'AI & Trading' : 'الذكاء الاصطناعي والتداول'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {aiItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 text-white hover:bg-trading-secondary hover:text-trading-up transition-colors",
                          lang === 'ar' && 'rtl justify-end'
                        )}
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
            <SidebarGroupLabel className={cn("text-gray-400", lang === 'ar' && 'rtl')}>
              {lang === 'en' ? 'Account' : 'الحساب'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 text-white hover:bg-trading-secondary hover:text-trading-down transition-colors",
                          lang === 'ar' && 'rtl justify-end'
                        )}
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
