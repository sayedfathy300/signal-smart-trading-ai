import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  Database,
  Bot,
  Activity,
  PieChart,
  Settings,
  Target,
  Users,
  Lock,
  Cube
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  lang: 'en' | 'ar';
}

export function AppSidebar({ lang }: AppSidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    {
      title: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      icon: BarChart3,
      url: '/dashboard'
    },
    {
      title: lang === 'ar' ? 'الرسوم البيانية' : 'Charts',
      icon: TrendingUp,
      url: '/charts'
    },
    {
      title: lang === 'ar' ? 'التحليل' : 'Analysis',
      icon: Activity,
      url: '/analysis'
    },
    {
      title: lang === 'ar' ? 'المحفظة' : 'Portfolio',
      icon: PieChart,
      url: '/portfolio'
    },
    {
      title: lang === 'ar' ? 'روبوت التداول' : 'Trading Bot',
      icon: Bot,
      url: '/trading-bot'
    },
    {
      title: lang === 'ar' ? 'منصة التداول' : 'Trading Platform',
      icon: Target,
      url: '/trading-platform'
    },
    {
      title: lang === 'ar' ? 'التداول عالي التردد' : 'High Frequency Trading',
      icon: Zap,
      url: '/high-frequency-trading'
    },
    {
      title: lang === 'ar' ? 'إدارة المخاطر' : 'Risk Management',
      icon: Shield,
      url: '/risk-management'
    },
    {
      title: lang === 'ar' ? 'البيانات البديلة' : 'Alternative Data',
      icon: Database,
      url: '/alternative-data'
    },
    {
      title: lang === 'ar' ? 'نماذج الذكاء الاصطناعي' : 'AI Models',
      icon: Brain,
      url: '/ai-models'
    },
    {
      title: lang === 'ar' ? 'التعلم المستمر' : 'Continuous Learning',
      icon: Settings,
      url: '/continuous-learning'
    },
    {
      title: lang === 'ar' ? 'الذكاء الاصطناعي القابل للتفسير' : 'Explainable AI',
      icon: Users,
      url: '/explainable-ai'
    },
    {
      title: lang === 'ar' ? 'الأمان' : 'Security',
      icon: Lock,
      url: '/security'
    },
    {
      title: lang === 'ar' ? 'الواجهة المتقدمة' : 'Advanced UI',
      icon: Cube,
      url: '/advanced-ui'
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-800 p-4">
        <Link to="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold text-white">
            {lang === 'ar' ? 'منصة التداول الذكي' : 'AI Trading Platform'}
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="bg-trading-card">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wide px-4 py-2">
            {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
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
      
      <SidebarFooter className="border-t border-gray-800 p-4">
        <div className="text-center text-xs text-gray-500">
          {lang === 'ar' ? 'منصة التداول الذكي v1.0' : 'AI Trading Platform v1.0'}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
