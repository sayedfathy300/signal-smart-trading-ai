
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Award, 
  Bell,
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  BookOpen,
  Timer
} from 'lucide-react';

interface CommunityFeaturesProps {
  lang?: 'en' | 'ar';
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  type: 'analysis' | 'news' | 'strategy' | 'discussion';
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isPrivate: boolean;
  recentActivity: string;
  trending: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'webinar' | 'workshop' | 'discussion' | 'contest';
  participants: number;
  maxParticipants: number;
  host: string;
  status: 'upcoming' | 'live' | 'completed';
}

const CommunityFeatures = ({ lang = 'ar' }: CommunityFeaturesProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // محاكاة تحميل البيانات
    setPosts([
      {
        id: '1',
        author: {
          name: 'أحمد المتداول',
          avatar: '/api/placeholder/40/40',
          verified: true,
          level: 'خبير'
        },
        content: 'تحليل متعمق لحركة الذهب اليوم - ارتداد قوي من مستوى الدعم 1950. توقع استمرار الصعود نحو 1980.',
        timestamp: '2024-03-15 14:30',
        likes: 45,
        comments: 12,
        shares: 8,
        tags: ['ذهب', 'تحليل_فني', 'توصية'],
        type: 'analysis'
      },
      {
        id: '2',
        author: {
          name: 'سارة التقنية',
          avatar: '/api/placeholder/40/40',
          verified: true,
          level: 'متقدم'
        },
        content: 'استراتيجية جديدة للتداول على المدى القصير باستخدام مؤشر RSI مع Bollinger Bands. نتائج ممتازة في الباك تست!',
        timestamp: '2024-03-15 13:15',
        likes: 67,
        comments: 23,
        shares: 15,
        tags: ['استراتيجية', 'مؤشرات_فنية', 'باك_تست'],
        type: 'strategy'
      }
    ]);

    setGroups([
      {
        id: '1',
        name: 'متداولو الذهب المحترفون',
        description: 'مجموعة مخصصة لتداول الذهب والمعادن الثمينة',
        members: 1250,
        category: 'commodities',
        isPrivate: false,
        recentActivity: 'منذ 5 دقائق',
        trending: true
      },
      {
        id: '2',
        name: 'استراتيجيات الفوركس المتقدمة',
        description: 'تطوير ومشاركة استراتيجيات التداول المتقدمة',
        members: 890,
        category: 'forex',
        isPrivate: true,
        recentActivity: 'منذ 15 دقيقة',
        trending: false
      }
    ]);

    setEvents([
      {
        id: '1',
        title: 'ورشة عمل: التحليل الفني المتقدم',
        description: 'تعلم أحدث تقنيات التحليل الفني مع الخبراء',
        date: '2024-03-20',
        time: '19:00',
        type: 'workshop',
        participants: 45,
        maxParticipants: 100,
        host: 'محمد الخبير',
        status: 'upcoming'
      },
      {
        id: '2',
        title: 'مسابقة التداول الشهرية',
        description: 'تنافس مع أفضل المتداولين واربح جوائز قيمة',
        date: '2024-03-25',
        time: '09:00',
        type: 'contest',
        participants: 234,
        maxParticipants: 500,
        host: 'إدارة المنصة',
        status: 'upcoming'
      }
    ]);
  }, []);

  const formatArabicNumber = (num: number) => {
    return num.toLocaleString('ar-EG');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return <TrendingUp className="h-4 w-4" />;
      case 'strategy':
        return <BookOpen className="h-4 w-4" />;
      case 'news':
        return <Bell className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'webinar':
        return <Users className="h-4 w-4" />;
      case 'workshop':
        return <BookOpen className="h-4 w-4" />;
      case 'contest':
        return <Award className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {lang === 'ar' ? 'المجتمع التداولي' : 'Trading Community'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'تواصل مع المتداولين وشارك الخبرات والاستراتيجيات'
              : 'Connect with traders, share experiences and strategies'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {lang === 'ar' ? 'منشور جديد' : 'New Post'}
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={lang === 'ar' ? 'البحث في المجتمع...' : 'Search community...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-trading-card border-gray-600 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600">
          <Filter className="h-4 w-4 mr-2" />
          {lang === 'ar' ? 'تصفية' : 'Filter'}
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-trading-card">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {lang === 'ar' ? 'التغذية' : 'Feed'}
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {lang === 'ar' ? 'المجموعات' : 'Groups'}
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {lang === 'ar' ? 'الفعاليات' : 'Events'}
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="bg-trading-card border-gray-700">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{post.author.name}</h4>
                        {post.author.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {post.author.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(post.type)}
                    <Badge variant="outline" className="text-xs">
                      {lang === 'ar' ? 
                        (post.type === 'analysis' ? 'تحليل' : 
                         post.type === 'strategy' ? 'استراتيجية' : 
                         post.type === 'news' ? 'أخبار' : 'نقاش') :
                        post.type}
                    </Badge>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                      <Heart className="h-4 w-4 mr-1" />
                      {formatArabicNumber(post.likes)}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {formatArabicNumber(post.comments)}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                      <Share2 className="h-4 w-4 mr-1" />
                      {formatArabicNumber(post.shares)}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <Card key={group.id} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group.name}
                      {group.trending && (
                        <Badge className="bg-orange-500 text-white">
                          {lang === 'ar' ? 'رائج' : 'Trending'}
                        </Badge>
                      )}
                    </CardTitle>
                    {group.isPrivate && (
                      <Badge variant="outline">
                        {lang === 'ar' ? 'خاص' : 'Private'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{group.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatArabicNumber(group.members)} {lang === 'ar' ? 'عضو' : 'members'}</span>
                      <span>{group.recentActivity}</span>
                    </div>
                    <Badge variant="secondary">{group.category}</Badge>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {lang === 'ar' ? 'انضمام' : 'Join Group'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {getEventIcon(event.type)}
                    {event.title}
                    <Badge 
                      className={
                        event.status === 'live' ? 'bg-red-500' :
                        event.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-500'
                      }
                    >
                      {lang === 'ar' ? 
                        (event.status === 'live' ? 'مباشر' : 
                         event.status === 'upcoming' ? 'قادم' : 'مكتمل') :
                        event.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                      <Timer className="h-4 w-4 ml-2" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>
                        {formatArabicNumber(event.participants)}/{formatArabicNumber(event.maxParticipants)} 
                        {lang === 'ar' ? ' مشارك' : ' participants'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{lang === 'ar' ? 'المضيف:' : 'Host:'} {event.host}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(event.participants / event.maxParticipants) * 100}%` 
                      }}
                    />
                  </div>

                  <Button 
                    className={
                      event.status === 'live' ? 'w-full bg-red-600 hover:bg-red-700' :
                      event.status === 'upcoming' ? 'w-full bg-green-600 hover:bg-green-700' :
                      'w-full bg-gray-600 hover:bg-gray-700'
                    }
                    disabled={event.status === 'completed'}
                  >
                    {lang === 'ar' ? 
                      (event.status === 'live' ? 'انضمام الآن' : 
                       event.status === 'upcoming' ? 'تسجيل الاشتراك' : 'مكتمل') :
                      (event.status === 'live' ? 'Join Now' : 
                       event.status === 'upcoming' ? 'Register' : 'Completed')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityFeatures;
