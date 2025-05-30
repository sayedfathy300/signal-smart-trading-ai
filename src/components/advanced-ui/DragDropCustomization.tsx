
import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Eye,
  EyeOff,
  Settings,
  RotateCcw
} from 'lucide-react';

interface DashboardItem {
  id: string;
  type: 'chart' | 'stats' | 'news' | 'portfolio' | 'trades';
  title: string;
  titleAr: string;
  icon: React.ReactNode;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DragDropCustomizationProps {
  lang: 'en' | 'ar';
  onLayoutChange: (items: DashboardItem[]) => void;
}

const ItemType = 'DASHBOARD_ITEM';

const DraggableItem: React.FC<{
  item: DashboardItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  toggleVisibility: (id: string) => void;
  lang: 'en' | 'ar';
}> = ({ item, index, moveItem, toggleVisibility, lang }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${!item.visible ? 'bg-gray-900' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-500" />
          {item.icon}
          <span className={`text-sm ${item.visible ? 'text-white' : 'text-gray-500'}`}>
            {lang === 'ar' ? item.titleAr : item.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={item.visible ? "default" : "secondary"} className="text-xs">
            {item.visible ? 
              (lang === 'ar' ? 'مرئي' : 'Visible') :
              (lang === 'ar' ? 'مخفي' : 'Hidden')
            }
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleVisibility(item.id)}
            className="h-6 w-6 p-0"
          >
            {item.visible ? 
              <EyeOff className="h-3 w-3" /> : 
              <Eye className="h-3 w-3" />
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

const GridLayout: React.FC<{
  items: DashboardItem[];
  onItemMove: (id: string, position: { x: number; y: number }) => void;
  lang: 'en' | 'ar';
}> = ({ items, onItemMove, lang }) => {
  const [, drop] = useDrop({
    accept: 'GRID_ITEM',
    drop: (item: { id: string }, monitor) => {
      const offset = monitor.getDropResult();
      if (offset) {
        onItemMove(item.id, offset);
      }
    },
  });

  return (
    <div
      ref={drop}
      className="relative w-full h-96 bg-gray-900 rounded-lg border-2 border-dashed border-gray-700 p-4"
      style={{ 
        backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      <div className="absolute top-2 left-2 text-xs text-gray-500">
        {lang === 'ar' ? 'منطقة التخطيط - اسحب العناصر هنا' : 'Layout Area - Drag items here'}
      </div>
      {items.filter(item => item.visible).map((item) => (
        <GridItem key={item.id} item={item} lang={lang} />
      ))}
    </div>
  );
};

const GridItem: React.FC<{
  item: DashboardItem;
  lang: 'en' | 'ar';
}> = ({ item, lang }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'GRID_ITEM',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // Handle drop result
      }
    },
  });

  return (
    <div
      ref={drag}
      className={`absolute bg-trading-card border border-gray-600 rounded-lg p-2 cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
        width: `${item.size.width}%`,
        height: `${item.size.height}%`,
        minWidth: '120px',
        minHeight: '80px'
      }}
    >
      <div className="flex items-center gap-2 text-white text-sm">
        {item.icon}
        <span>{lang === 'ar' ? item.titleAr : item.title}</span>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {lang === 'ar' ? 'محتوى العنصر' : 'Item content'}
      </div>
    </div>
  );
};

const DragDropCustomization: React.FC<DragDropCustomizationProps> = ({ lang, onLayoutChange }) => {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([
    {
      id: 'chart1',
      type: 'chart',
      title: 'Price Chart',
      titleAr: 'رسم الأسعار',
      icon: <BarChart3 className="h-4 w-4" />,
      visible: true,
      position: { x: 10, y: 10 },
      size: { width: 40, height: 40 }
    },
    {
      id: 'stats1',
      type: 'stats',
      title: 'Trading Stats',
      titleAr: 'إحصائيات التداول',
      icon: <TrendingUp className="h-4 w-4" />,
      visible: true,
      position: { x: 55, y: 10 },
      size: { width: 35, height: 25 }
    },
    {
      id: 'portfolio1',
      type: 'portfolio',
      title: 'Portfolio Overview',
      titleAr: 'نظرة عامة على المحفظة',
      icon: <PieChart className="h-4 w-4" />,
      visible: true,
      position: { x: 10, y: 55 },
      size: { width: 35, height: 35 }
    },
    {
      id: 'activity1',
      type: 'trades',
      title: 'Recent Activity',
      titleAr: 'النشاط الأخير',
      icon: <Activity className="h-4 w-4" />,
      visible: false,
      position: { x: 55, y: 40 },
      size: { width: 35, height: 45 }
    }
  ]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setDashboardItems((prevItems) => {
      const draggedItem = prevItems[dragIndex];
      const newItems = [...prevItems];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      return newItems;
    });
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setDashboardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  }, []);

  const handleItemMove = useCallback((id: string, position: { x: number; y: number }) => {
    setDashboardItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, position } : item
      )
    );
  }, []);

  const resetLayout = () => {
    setDashboardItems((prevItems) =>
      prevItems.map((item, index) => ({
        ...item,
        position: { 
          x: (index % 2) * 45 + 10, 
          y: Math.floor(index / 2) * 30 + 10 
        },
        visible: true
      }))
    );
  };

  const saveLayout = () => {
    onLayoutChange(dashboardItems);
    localStorage.setItem('dashboard-layout', JSON.stringify(dashboardItems));
  };

  const loadLayout = () => {
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        setDashboardItems(parsed);
      } catch (error) {
        console.error('Error loading layout:', error);
      }
    }
  };

  React.useEffect(() => {
    loadLayout();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {lang === 'ar' ? 'تخصيص التخطيط' : 'Layout Customization'}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={resetLayout}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>
              <Button
                size="sm"
                onClick={saveLayout}
                className="bg-trading-primary hover:bg-trading-primary/90"
              >
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              {lang === 'ar' ? 'عناصر لوحة التحكم:' : 'Dashboard Items:'}
            </h4>
            <div className="space-y-2">
              {dashboardItems.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  index={index}
                  moveItem={moveItem}
                  toggleVisibility={toggleVisibility}
                  lang={lang}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              {lang === 'ar' ? 'معاينة التخطيط:' : 'Layout Preview:'}
            </h4>
            <GridLayout
              items={dashboardItems}
              onItemMove={handleItemMove}
              lang={lang}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {lang === 'ar' ? 
                `${dashboardItems.filter(i => i.visible).length} من ${dashboardItems.length} عنصر مرئي` :
                `${dashboardItems.filter(i => i.visible).length} of ${dashboardItems.length} items visible`
              }
            </span>
            <span>
              {lang === 'ar' ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
            </span>
          </div>
        </CardContent>
      </Card>
    </DndProvider>
  );
};

export default DragDropCustomization;
