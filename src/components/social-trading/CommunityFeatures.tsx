
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Calendar,
  MapPin,
  Trophy,
  Star,
  TrendingUp,
  Send,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  UserPlus,
  DollarSign
} from 'lucide-react';

interface CommunityFeaturesProps {
  lang?: 'en' | 'ar';
}

const CommunityFeatures = ({ lang = 'ar' }: CommunityFeaturesProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // بيانات تجريبية للمجتمع
  const communityPosts = [
    {
      id: '1',
      author: {
        name: lang === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
        avatar: '/api/placeholder/40/40',
        level: 'Expert',
        followers: 1250
      },
      content: lang === 'ar' 
        ? 'شاركت استراتيجية جديدة للتداول على البيتكوين حققت 15% ربح في الأسبوع الماضي. ما رأيكم؟'
        : 'Just shared a new Bitcoin trading strategy that made 15% profit last week. What do you think?',
      timestamp: '2 ساعة',
      likes: 45,
      comments: 12,
      shares: 8,
      tags: ['Bitcoin', 'Strategy', 'Profit'],
      image: '/api/placeholder/400/200'
    },
    {
      id: '2',
      author: {
        name: lang === 'ar' ? 'فاطمة علي' : 'Fatima Ali',
        avatar: '/api/placeholder/40/40',
        level: 'Pro',
        followers: 890
      },
      content: lang === 'ar'
        ? 'تحليل فني شامل لزوج EUR/USD - توقع ارتفاع محتمل خلال الأيام القادمة'
        : 'Comprehensive technical analysis for EUR/USD pair - expecting potential rise in coming days',
      timestamp: '4 ساعات',
      likes: 32,
      comments: 7,
      shares: 5,
      tags: ['EUR/USD', 'Technical Analysis', 'Forex']
    },
    {
      id: '3',
      author: {
        name: lang === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed',
        avatar: '/api/placeholder/40/40',
        level: 'Advanced',
        followers: 650
      },
      content: lang === 'ar'
        ? 'ما رأيكم في الاستثمار في الذهب كملاذ آمن في ظل التقلبات الحالية؟'
        : 'What are your thoughts on investing in gold as a safe haven during current volatilities?',
      timestamp: '6 ساعات',
      likes: 28,
      comments: 15,
      shares: 3,
      tags: ['Gold', 'Safe Haven', 'Investment']
    }
  ];

  const tradingGroups = [
    {
      id: '1',
      name: lang === 'ar' ? 'متداولو البيتكوين' : 'Bitcoin Traders',
      description: lang === 'ar' ? 'مجموعة للنقاش حول تداول البيتكوين والعملات المشفرة' : 'Group for discussing Bitcoin and crypto trading',
      members: 2456,
      posts: 1250,
      image: '/api/placeholder/60/60',
      category: 'Cryptocurrency',
      isJoined: true
    },
    {
      id: '2',
      name: lang === 'ar' ? 'تحليل الفوركس' : 'Forex Analysis',
      description: lang === 'ar' ? 'تحليلات فنية ومشاركة إشارات الفوركس' : 'Technical analysis and forex signals sharing',
      members: 1890,
      posts: 890,
      image: '/api/placeholder/60/60',
      category: 'Forex',
      isJoined: false
    },
    {
      id: '3',
      name: lang === 'ar' ? 'المبتدئون في التداول' : 'Trading Beginners',
      description: lang === 'ar' ? 'مساعدة المبتدئين وتعلم أساسيات التداول' : 'Helping beginners learn trading basics',
      members: 3200,
      posts: 2100,
      image: '/api/placeholder/60/60',
      category: 'Education',
      isJoined: true
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: lang === 'ar' ? 'ندوة تحليل السوق الأسبوعية' : 'Weekly Market Analysis Webinar',
      date: '2024-01-15',
      time: '20:00',
      participants: 450,
      host: lang === 'ar' ? 'خبير التحليل الفني' : 'Technical Analysis Expert',
      type: 'Webinar'
    },
    {
      id: '2',
      title: lang === 'ar' ? 'مسابقة التداول الشهرية' : 'Monthly Trading Competition',
      date: '2024-01-20',
      time: '00:00',
      participants: 1200,
      host: lang === 'ar' ? 'فريق المنصة' : 'Platform Team',
      type: 'Competition',
      prize: '$5000'
    },
    {
      id: '3',
      title: lang === 'ar' ? 'ورشة استراتيجيات التداول' : 'Trading Strategies Workshop',
      date: '2024-01-25',
      time: '18:30',
      participants: 300,
      host: lang === 'ar' ? 'المتداول المحترف أحمد' : 'Pro Trader Ahmed',
      type: 'Workshop'
    }
  ];

  const handleLikePost = (postId: string) => {
    console.log(`Liked post: ${postId}`);
  };

  const handleSharePost = (postId: string) => {
    console.log(`Shared post: ${postId}`);
  };

  const handleJoinGroup = (groupId: string) => {
    console.log(`Joined group: ${groupId}`);
  };

  const handleJoinEvent = (eventId: string) => {
    console.log(`Joined event: ${eventId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {lang === 'ar' ? 'مجتمع المتداولين' : 'Trading Community'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'تفاعل مع المتداولين وشارك في النقاشات والفعاليات'
              : 'Interact with traders and participate in discussions and events'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-gray-600">
            <Bell className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600">
            <Settings className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
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
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {lang === 'ar' ? 'المتصدرين' : 'Leaderboard'}
          </TabsTrigger>
        </TabsList>

        {/* Community Feed */}
        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder={lang === 'ar' ? 'شارك أفكارك التداولية...' : 'Share your trading thoughts...'}
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="bg-trading-secondary border-gray-700 text-white resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400">
                            <MapPin className="h-4 w-4 mr-2" />
                            {lang === 'ar' ? 'الموقع' : 'Location'}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {lang === 'ar' ? 'حدث' : 'Event'}
                          </Button>
                        </div>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={!newPost.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {lang === 'ar' ? 'نشر' : 'Post'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts */}
              {communityPosts.map((post) => (
                <Card key={post.id} className="bg-trading-card border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white">{post.author.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {post.author.level}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            {post.author.followers} {lang === 'ar' ? 'متابع' : 'followers'}
                          </span>
                          <span className="text-gray-500 text-sm">• {post.timestamp}</span>
                        </div>
                        
                        <p className="text-gray-300 mb-3">{post.content}</p>
                        
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post content"
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-600">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSharePost(post.id)}
                            className="text-gray-400 hover:text-blue-400"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    {lang === 'ar' ? 'المواضيع الرائجة' : 'Trending Topics'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['#Bitcoin', '#DollarIndex', '#Gold', '#EUR_USD', '#TechnicalAnalysis'].map((topic) => (
                    <div key={topic} className="flex items-center justify-between">
                      <span className="text-blue-400 cursor-pointer hover:underline">
                        {topic}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {Math.floor(Math.random() * 100) + 20}k {lang === 'ar' ? 'منشور' : 'posts'}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Suggested Groups */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    {lang === 'ar' ? 'مجموعات مقترحة' : 'Suggested Groups'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tradingGroups.slice(0, 3).map((group) => (
                    <div key={group.id} className="flex items-center gap-3">
                      <img 
                        src={group.image} 
                        alt={group.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{group.name}</div>
                        <div className="text-gray-400 text-xs">
                          {group.members} {lang === 'ar' ? 'عضو' : 'members'}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-gray-600 text-xs">
                        {lang === 'ar' ? 'انضم' : 'Join'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Trading Groups */}
        <TabsContent value="groups" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={lang === 'ar' ? 'البحث في المجموعات...' : 'Search groups...'}
                className="pl-10 bg-trading-secondary border-gray-700 text-white"
              />
            </div>
            <Button variant="outline" className="border-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تصفية' : 'Filter'}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'إنشاء مجموعة' : 'Create Group'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradingGroups.map((group) => (
              <Card key={group.id} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={group.image} 
                      alt={group.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{group.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {group.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{group.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>
                        <Users className="h-4 w-4 inline mr-1" />
                        {group.members.toLocaleString()}
                      </span>
                      <span>
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        {group.posts}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    className={`w-full ${group.isJoined 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    {group.isJoined 
                      ? (lang === 'ar' ? 'منضم' : 'Joined')
                      : (lang === 'ar' ? 'انضم' : 'Join')
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              {lang === 'ar' ? 'الفعاليات القادمة' : 'Upcoming Events'}
            </h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'إنشاء فعالية' : 'Create Event'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-2">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <span>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {event.date}
                        </span>
                        <span>
                          <Clock className="h-4 w-4 inline mr-1" />
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>
                          <Users className="h-4 w-4 inline mr-1" />
                          {event.participants} {lang === 'ar' ? 'مشارك' : 'participants'}
                        </span>
                        <span>
                          <Star className="h-4 w-4 inline mr-1" />
                          {event.host}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-600">
                      {event.type}
                    </Badge>
                  </div>
                  
                  {event.prize && (
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">
                        {lang === 'ar' ? 'جائزة:' : 'Prize:'} {event.prize}
                      </span>
                    </div>
                  )}
                  
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleJoinEvent(event.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'الانضمام للفعالية' : 'Join Event'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Community Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                {lang === 'ar' ? 'متصدرو المجتمع' : 'Community Leaderboard'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center gap-4 p-3 bg-trading-secondary rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      rank === 1 ? 'bg-yellow-400 text-black' :
                      rank === 2 ? 'bg-gray-300 text-black' :
                      rank === 3 ? 'bg-orange-400 text-black' :
                      'bg-gray-600 text-white'
                    }`}>
                      {rank}
                    </div>
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>U{rank}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {lang === 'ar' ? `المتداول ${rank}` : `Trader ${rank}`}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {(1000 - rank * 50)} {lang === 'ar' ? 'نقطة' : 'points'}
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">
                      +{(25 - rank * 2)}% {lang === 'ar' ? 'ربح' : 'profit'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityFeatures;
