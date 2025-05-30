
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { smartRecommendationsService, RealtimeNotification } from '@/services/smartRecommendationsService';
import { Bell, BellRing, AlertTriangle, CheckCircle, Info, TrendingUp, X, Settings } from 'lucide-react';

interface RealtimeNotificationsProps {
  lang?: 'en' | 'ar';
}

export const RealtimeNotifications: React.FC<RealtimeNotificationsProps> = ({ lang = 'ar' }) => {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    if (isEnabled) {
      smartRecommendationsService.startRealtimeMonitoring();
      
      const unsubscribe = smartRecommendationsService.subscribeToNotifications((notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        if (soundEnabled) {
          playNotificationSound(notification.type);
        }
        
        // إظهار إشعار المتصفح
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      });
      
      return unsubscribe;
    }
  }, [isEnabled, soundEnabled]);

  const loadNotifications = async () => {
    try {
      const data = await smartRecommendationsService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const playNotificationSound = (type: string) => {
    const audio = new Audio();
    switch (type) {
      case 'success':
      case 'opportunity':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D0vWYdBSuU3fLNeyoF';
        break;
      case 'warning':
      case 'error':
        audio.src = 'data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YeAGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSsF';
        break;
      default:
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D0vWYdBSuU3fLNeyoF';
    }
    audio.play().catch(() => {});
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await smartRecommendationsService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.isRead)
          .map(n => smartRecommendationsService.markAsRead(n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Notifications Header */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              {unreadCount > 0 ? (
                <BellRing className="h-5 w-5 text-yellow-500 animate-pulse" />
              ) : (
                <Bell className="h-5 w-5 text-gray-400" />
              )}
              {lang === 'ar' ? 'الإشعارات المباشرة' : 'Real-time Notifications'}
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
                <span className="text-sm text-gray-400">
                  {lang === 'ar' ? 'تفعيل الإشعارات' : 'Enable Notifications'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
                <span className="text-sm text-gray-400">
                  {lang === 'ar' ? 'الصوت' : 'Sound'}
                </span>
              </div>
              
              <Button
                onClick={requestNotificationPermission}
                size="sm"
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'إعدادات' : 'Settings'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notification Filters */}
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
                { key: 'unread', label: lang === 'ar' ? 'غير مقروء' : 'Unread' },
                { key: 'opportunity', label: lang === 'ar' ? 'فرص' : 'Opportunities' },
                { key: 'warning', label: lang === 'ar' ? 'تحذيرات' : 'Warnings' },
                { key: 'success', label: lang === 'ar' ? 'نجح' : 'Success' }
              ].map(filterOption => (
                <Button
                  key={filterOption.key}
                  size="sm"
                  variant={filter === filterOption.key ? 'default' : 'ghost'}
                  onClick={() => setFilter(filterOption.key)}
                >
                  {filterOption.label}
                </Button>
              ))}
            </div>
            
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                size="sm"
                variant="outline"
              >
                {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All as Read'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                {lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.isRead ? 'bg-blue-500/10' : 'bg-gray-800/50'
                    } hover:bg-gray-700/50 transition-colors`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>
                              {new Date(notification.timestamp).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                            </span>
                            
                            <Badge variant="secondary" className="text-xs">
                              {notification.priority}
                            </Badge>
                            
                            {notification.symbol && (
                              <Badge variant="outline" className="text-xs">
                                {notification.symbol}
                              </Badge>
                            )}
                            
                            {notification.action && (
                              <Badge 
                                className={`text-xs ${
                                  notification.action === 'BUY' ? 'bg-green-500' :
                                  notification.action === 'SELL' ? 'bg-red-500' :
                                  'bg-blue-500'
                                } text-white`}
                              >
                                {notification.action}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeNotification(notification.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{notifications.length}</div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'إجمالي الإشعارات' : 'Total Notifications'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BellRing className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-white">{unreadCount}</div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'غير مقروء' : 'Unread'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {notifications.filter(n => n.type === 'opportunity').length}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'فرص' : 'Opportunities'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {notifications.filter(n => n.type === 'warning' || n.type === 'error').length}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'تحذيرات' : 'Warnings'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
