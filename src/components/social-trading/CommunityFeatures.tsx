
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Users,
  Plus,
  Heart,
  Share2,
  MessageSquare,
  TrendingUp,
  Calendar,
  MapPin,
  Globe,
  Filter,
  Search,
  Send,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Bookmark,
  Eye,
  Clock,
  Star,
  Award,
  Target,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  Settings,
  UserPlus,
  Bell,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: string;
    followers: number;
  };
  content: string;
  type: 'text' | 'analysis' | 'signal' | 'news' | 'question';
  category: string;
  tags: string[];
  attachments?: Array<{
    type: 'image' | 'chart' | 'link';
    url: string;
    description?: string;
  }>;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  parentId?: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  privacy: 'public' | 'private';
  members: number;
  posts: number;
  admin: {
    id: string;
    name: string;
    username: string;
  };
  isJoined: boolean;
  tags: string[];
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  type: 'webinar' | 'workshop' | 'meetup' | 'conference';
  date: string;
  time: string;
  location?: string;
  isOnline: boolean;
  participants: number;
  maxParticipants?: number;
  price: number;
  isJoined: boolean;
  tags: string[];
}

interface CommunityFeaturesProps {
  lang?: 'en' | 'ar';
}

const CommunityFeatures = ({ lang = 'ar' }: CommunityFeaturesProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: lang === 'ar' ? 'جميع الفئات' : 'All Categories' },
    { id: 'analysis', name: lang === 'ar' ? 'تحليل' : 'Analysis' },
    { id: 'signals', name: lang === 'ar' ? 'إشارات' : 'Signals' },
    { id: 'news', name: lang === 'ar' ? 'أخبار' : 'News' },
    { id: 'education', name: lang === 'ar' ? 'تعليم' : 'Education' },
    { id: 'discussion', name: lang === 'ar' ? 'نقاش' : 'Discussion' },
    { id: 'help', name: lang === 'ar' ? 'مساعدة' : 'Help' }
  ];

  const postTypes = [
    { id: 'text', name: lang === 'ar' ? 'نص' : 'Text', icon: MessageCircle },
    { id: 'analysis', name: lang === 'ar' ? 'تحليل' : 'Analysis', icon: TrendingUp },
    { id: 'signal', name: lang === 'ar' ? 'إشارة' : 'Signal', icon: Target },
    { id: 'news', name: lang === 'ar' ? 'خبر' : 'News', icon: Globe },
    { id: 'question', name: lang === 'ar' ? 'سؤال' : 'Question', icon: MessageSquare }
  ];

  // Load mock data
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: '1',
        author: {
          id: '1',
          name: 'أحمد محمد',
          username: '@ahmed_analyst',
          avatar: '/api/placeholder/150/150',
          verified: true,
          level: 'Expert',
          followers: 5432
        },
        content: 'تحليل فني شامل لزوج EUR/USD - نتوقع كسر المقاومة عند 1.0950 والصعود نحو 1.1000. الاتجاه العام صاعد مع دعم قوي عند 1.0900. #EURUSD #تحليل_فني',
        type: 'analysis',
        category: 'analysis',
        tags: ['EURUSD', 'Technical Analysis', 'Forex'],
        attachments: [
          {
            type: 'chart',
            url: '/api/placeholder/400/300',
            description: 'EUR/USD 4H Chart Analysis'
          }
        ],
        stats: {
          likes: 127,
          comments: 23,
          shares: 45,
          views: 892
        },
        isLiked: false,
        isBookmarked: false,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        author: {
          id: '2',
          name: 'سارة أحمد',
          username: '@sara_trader',
          avatar: '/api/placeholder/150/150',
          verified: true,
          level: 'Professional',
          followers: 3421
        },
        content: '🚨 إشارة شراء BTC/USDT 🚨\n\nالدخول: 43,500\nالهدف الأول: 45,000\nالهدف الثاني: 46,500\nوقف الخسارة: 42,000\n\nنسبة المخاطرة للعائد: 1:3\n\n#Bitcoin #إشارة_تداول',
        type: 'signal',
        category: 'signals',
        tags: ['Bitcoin', 'BTC', 'Signal', 'Crypto'],
        stats: {
          likes: 89,
          comments: 15,
          shares: 67,
          views: 1245
        },
        isLiked: true,
        isBookmarked: true,
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
      },
      {
        id: '3',
        author: {
          id: '3',
          name: 'محمد العلي',
          username: '@mohammed_news',
          avatar: '/api/placeholder/150/150',
          verified: false,
          level: 'Intermediate',
          followers: 1567
        },
        content: 'البنك المركزي الأوروبي يشير إلى احتمالية خفض أسعار الفائدة في الربع القادم. هذا قد يؤثر سلبياً على اليورو مقابل الدولار. ما رأيكم في هذا التطور؟',
        type: 'news',
        category: 'news',
        tags: ['ECB', 'Interest Rates', 'EUR', 'Monetary Policy'],
        stats: {
          likes: 45,
          comments: 32,
          shares: 12,
          views: 678
        },
        isLiked: false,
        isBookmarked: false,
        createdAt: '2024-01-15T08:45:00Z',
        updatedAt: '2024-01-15T08:45:00Z'
      }
    ];

    const mockGroups: Group[] = [
      {
        id: '1',
        name: 'متداولو الفوركس العرب',
        description: 'مجموعة للمتداولين العرب المهتمين بأسواق الفوركس',
        avatar: '/api/placeholder/150/150',
        category: 'forex',
        privacy: 'public',
        members: 15234,
        posts: 892,
        admin: {
          id: '1',
          name: 'أحمد محمد',
          username: '@ahmed_admin'
        },
        isJoined: true,
        tags: ['Forex', 'التداول', 'العرب'],
        createdAt: '2023-06-15'
      },
      {
        id: '2',
        name: 'خبراء العملات الرقمية',
        description: 'مناقشات متقدمة حول العملات المشفرة والبلوك تشين',
        avatar: '/api/placeholder/150/150',
        category: 'crypto',
        privacy: 'public',
        members: 8945,
        posts: 567,
        admin: {
          id: '2',
          name: 'سارة أحمد',
          username: '@sara_crypto'
        },
        isJoined: false,
        tags: ['Crypto', 'Bitcoin', 'Blockchain'],
        createdAt: '2023-08-22'
      },
      {
        id: '3',
        name: 'مبتدئين التداول',
        description: 'مساعدة ودعم للمتداولين الجدد',
        avatar: '/api/placeholder/150/150',
        category: 'education',
        privacy: 'public',
        members: 23456,
        posts: 1234,
        admin: {
          id: '3',
          name: 'محمد العلي',
          username: '@mohammed_teach'
        },
        isJoined: true,
        tags: ['Education', 'Beginners', 'Learning'],
        createdAt: '2023-04-10'
      }
    ];

    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'ندوة تحليل الأسواق الأسبوعية',
        description: 'مراجعة شاملة لأداء الأسواق وتوقعات الأسبوع القادم',
        organizer: {
          id: '1',
          name: 'أحمد محمد',
          avatar: '/api/placeholder/150/150'
        },
        type: 'webinar',
        date: '2024-01-20',
        time: '20:00',
        isOnline: true,
        participants: 234,
        maxParticipants: 500,
        price: 0,
        isJoined: false,
        tags: ['Market Analysis', 'Weekly Review', 'Trading']
      },
      {
        id: '2',
        title: 'ورشة استراتيجيات التداول المتقدمة',
        description: 'تعلم أحدث استراتيجيات التداول والتحليل الفني',
        organizer: {
          id: '2',
          name: 'سارة أحمد',
          avatar: '/api/placeholder/150/150'
        },
        type: 'workshop',
        date: '2024-01-25',
        time: '18:00',
        location: 'دبي، الإمارات',
        isOnline: false,
        participants: 45,
        maxParticipants: 50,
        price: 150,
        isJoined: true,
        tags: ['Advanced Trading', 'Strategies', 'Workshop']
      }
    ];

    const mockComments: Comment[] = [
      {
        id: '1',
        postId: '1',
        author: {
          id: '4',
          name: 'علي أحمد',
          username: '@ali_trader',
          avatar: '/api/placeholder/150/150',
          verified: false
        },
        content: 'تحليل ممتاز! أتفق معك في نظرة الصعود. شكراً للمشاركة.',
        likes: 12,
        isLiked: false,
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: '2',
        postId: '1',
        author: {
          id: '5',
          name: 'فاطمة محمد',
          username: '@fatima_fx',
          avatar: '/api/placeholder/150/150',
          verified: true
        },
        content: 'هل تنصح بالدخول الآن أم انتظار كسر المقاومة؟',
        likes: 8,
        isLiked: true,
        createdAt: '2024-01-15T11:15:00Z'
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setGroups(mockGroups);
      setEvents(mockEvents);
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            stats: {
              ...post.stats,
              likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1
            }
          }
        : post
    ));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));

    toast.success(lang === 'ar' ? 'تم تحديث الإشارة المرجعية' : 'Bookmark updated');
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: {
        id: 'current_user',
        name: 'أنت',
        username: '@you',
        avatar: '/api/placeholder/150/150',
        verified: false,
        level: 'Beginner',
        followers: 0
      },
      content: newPost,
      type: 'text',
      category: 'discussion',
      tags: [],
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      },
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    toast.success(lang === 'ar' ? 'تم نشر المنشور بنجاح!' : 'Post published successfully!');
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId
        ? {
            ...group,
            isJoined: !group.isJoined,
            members: group.isJoined ? group.members - 1 : group.members + 1
          }
        : group
    ));
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? {
            ...event,
            isJoined: !event.isJoined,
            participants: event.isJoined ? event.participants - 1 : event.participants + 1
          }
        : event
    ));

    toast.success(lang === 'ar' ? 'تم تحديث التسجيل في الفعالية' : 'Event registration updated');
  };

  const getPostTypeIcon = (type: string) => {
    const postType = postTypes.find(pt => pt.id === type);
    return postType ? <postType.icon className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />;
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'analysis': return 'bg-blue-600';
      case 'signal': return 'bg-green-600';
      case 'news': return 'bg-purple-600';
      case 'question': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar': return <Globe className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'meetup': return <MapPin className="h-4 w-4" />;
      case 'conference': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">47,283</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'أعضاء نشطين' : 'Active Members'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">12,547</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'منشورات اليوم' : 'Posts Today'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">158</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'مجموعات' : 'Groups'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">23</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'فعاليات قادمة' : 'Upcoming Events'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="feed">
            {lang === 'ar' ? 'التغذية' : 'Feed'}
          </TabsTrigger>
          <TabsTrigger value="groups">
            {lang === 'ar' ? 'المجموعات' : 'Groups'}
          </TabsTrigger>
          <TabsTrigger value="events">
            {lang === 'ar' ? 'الفعاليات' : 'Events'}
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            {lang === 'ar' ? 'المتصدرين' : 'Leaderboard'}
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="space-y-6">
          {/* Create Post */}
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/150/150" alt="You" />
                    <AvatarFallback className="bg-trading-secondary text-white">أ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder={lang === 'ar' ? 'شارك أفكارك مع المجتمع...' : 'Share your thoughts with the community...'}
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-trading-secondary border-gray-600 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {postTypes.map(type => (
                      <Button
                        key={type.id}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-xs"
                      >
                        <type.icon className="h-3 w-3 mr-1" />
                        {type.name}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'نشر' : 'Post'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  <SelectItem value="recent">
                    {lang === 'ar' ? 'الأحدث' : 'Recent'}
                  </SelectItem>
                  <SelectItem value="popular">
                    {lang === 'ar' ? 'الأكثر شعبية' : 'Popular'}
                  </SelectItem>
                  <SelectItem value="trending">
                    {lang === 'ar' ? 'الرائج' : 'Trending'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="bg-trading-secondary text-white">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{post.author.name}</span>
                        {post.author.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-400" />
                        )}
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs", getPostTypeColor(post.type))}
                        >
                          {getPostTypeIcon(post.type)}
                          <span className="ml-1">
                            {postTypes.find(pt => pt.id === post.type)?.name}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {post.author.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{post.author.username}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" className="text-gray-400">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-white whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="mb-4">
                      {post.attachments.map((attachment, index) => (
                        <div key={index} className="bg-trading-secondary rounded-lg p-3">
                          {attachment.type === 'chart' && (
                            <div>
                              <img 
                                src={attachment.url} 
                                alt={attachment.description}
                                className="w-full rounded-lg"
                              />
                              {attachment.description && (
                                <p className="text-sm text-gray-400 mt-2">{attachment.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-trading-secondary">
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.stats.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.stats.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.stats.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.stats.shares}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLikePost(post.id)}
                        className={cn(
                          "gap-2",
                          post.isLiked ? "text-red-400" : "text-gray-400"
                        )}
                      >
                        <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                        {lang === 'ar' ? 'إعجاب' : 'Like'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPost(post)}
                        className="text-gray-400 gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {lang === 'ar' ? 'تعليق' : 'Comment'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        {lang === 'ar' ? 'مشاركة' : 'Share'}
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBookmarkPost(post.id)}
                      className={cn(
                        "gap-2",
                        post.isBookmarked ? "text-blue-400" : "text-gray-400"
                      )}
                    >
                      <Bookmark className={cn("h-4 w-4", post.isBookmarked && "fill-current")} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar} alt={group.name} />
                      <AvatarFallback className="bg-trading-secondary text-white">
                        {group.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{group.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{group.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{lang === 'ar' ? 'الأعضاء:' : 'Members:'}</span>
                      <span className="text-white">{group.members.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{lang === 'ar' ? 'المنشورات:' : 'Posts:'}</span>
                      <span className="text-white">{group.posts.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{lang === 'ar' ? 'المشرف:' : 'Admin:'}</span>
                      <span className="text-white">{group.admin.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 my-3">
                    {group.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-trading-secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleJoinGroup(group.id)}
                    className={cn(
                      "w-full",
                      group.isJoined 
                        ? "bg-gray-600 hover:bg-gray-700" 
                        : "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {group.isJoined 
                      ? (lang === 'ar' ? 'مغادرة المجموعة' : 'Leave Group')
                      : (lang === 'ar' ? 'انضمام للمجموعة' : 'Join Group')
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-trading-secondary rounded-lg">
                      {getEventTypeIcon(event.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{event.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{event.date} في {event.time}</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{event.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-white">
                        {event.participants} {lang === 'ar' ? 'مشارك' : 'participants'}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-white">
                        {event.price === 0 
                          ? (lang === 'ar' ? 'مجاني' : 'Free')
                          : `$${event.price}`
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-white">
                        {event.isOnline 
                          ? (lang === 'ar' ? 'عبر الإنترنت' : 'Online')
                          : (lang === 'ar' ? 'حضوري' : 'In-person')
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 my-3">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-trading-secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleJoinEvent(event.id)}
                    className={cn(
                      "w-full",
                      event.isJoined 
                        ? "bg-gray-600 hover:bg-gray-700" 
                        : "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.isJoined 
                      ? (lang === 'ar' ? 'إلغاء التسجيل' : 'Unregister')
                      : (lang === 'ar' ? 'تسجيل الحضور' : 'Register')
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'أكثر الأعضاء نشاطاً هذا الشهر' : 'Most Active Members This Month'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                        rank === 1 ? "bg-yellow-500" :
                        rank === 2 ? "bg-gray-400" :
                        rank === 3 ? "bg-amber-600" : "bg-gray-600"
                      )}>
                        {rank}
                      </div>
                      
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/api/placeholder/150/150" alt={`User ${rank}`} />
                        <AvatarFallback className="bg-trading-bg text-white">
                          U{rank}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-bold text-white">متداول {rank}</div>
                        <div className="text-sm text-gray-400">@trader{rank}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {1000 - (rank - 1) * 150} {lang === 'ar' ? 'نقطة' : 'points'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {50 - (rank - 1) * 8} {lang === 'ar' ? 'منشور' : 'posts'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Post Comments Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'التعليقات' : 'Comments'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-400"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Post Content */}
              <div className="p-4 bg-trading-secondary rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPost.author.avatar} alt={selectedPost.author.name} />
                    <AvatarFallback className="bg-trading-bg text-white text-sm">
                      {selectedPost.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-bold text-white">{selectedPost.author.name}</span>
                    <div className="text-xs text-gray-400">{selectedPost.author.username}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{selectedPost.content}</p>
              </div>

              {/* Add Comment */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/150/150" alt="You" />
                  <AvatarFallback className="bg-trading-secondary text-white text-sm">أ</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder={lang === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...'}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-trading-secondary border-gray-600"
                  />
                  <Button
                    onClick={() => {
                      if (newComment.trim()) {
                        setNewComment('');
                        toast.success(lang === 'ar' ? 'تم إضافة التعليق' : 'Comment added');
                      }
                    }}
                    disabled={!newComment.trim()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments
                  .filter(comment => comment.postId === selectedPost.id)
                  .map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-trading-secondary rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="bg-trading-bg text-white text-sm">
                          {comment.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{comment.author.name}</span>
                          {comment.author.verified && (
                            <CheckCircle className="h-3 w-3 text-blue-400" />
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "text-xs gap-1 h-6 px-2",
                              comment.isLiked ? "text-red-400" : "text-gray-400"
                            )}
                          >
                            <Heart className={cn("h-3 w-3", comment.isLiked && "fill-current")} />
                            {comment.likes}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs gap-1 h-6 px-2 text-gray-400"
                          >
                            <Reply className="h-3 w-3" />
                            {lang === 'ar' ? 'رد' : 'Reply'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommunityFeatures;
