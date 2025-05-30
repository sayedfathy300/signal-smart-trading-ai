
import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, BarChart3, TrendingUp, PieChart, Activity, Eye, EyeOff, Settings, RotateCcw } from 'lucide-react';

const ItemType = 'DASHBOARD_ITEM';

interface DashboardItem {
  id: string;
  title: string;
  titleAr: string;
  icon: React.ReactElement;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DragDropCustomizationProps {
  lang: 'en' | 'ar';
}

const DraggableItem = ({ item, index, moveItem, toggleVisibility, lang }: {
  item: DashboardItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  toggleVisibility: (id: string) => void;
  lang: 'en' | 'ar';
}) => {
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
          <Badge
            variant={item.visible ? "default" : "secondary"}
            className="text-xs"
          >
            {item.visible ? (lang === 'ar' ? 'مرئي' : 'Visible') : (lang === 'ar' ? 'مخفي' : 'Hidden')}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleVisibility(item.id)}
            className="h-6 w-6 p-0"
          >
            {item.visible ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const GridLayout = ({ items, onItemMove, lang }: {
  items: DashboardItem[];
  onItemMove: (id: string, position: { x: number; y: number }) => void;
  lang: 'en' | 'ar';
}) => {
  const [, drop] = useDrop({
    accept: 'GRID_ITEM',
    drop: (item: { id: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const containerRect = (monitor.getDropResult() as any)?.getBoundingClientRect();
        if (containerRect) {
          const x = ((offset.x - containerRect.left) / containerRect.width) * 100;
          const y = ((offset.y - containerRect.top) / containerRect.height) * 100;
          onItemMove(item.id, { x: Math.max(0, Math.min(80, x)), y: Math.max(0, Math.min(80, y)) });
        }
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
      
      {items.filter(item => item.visible).map(item => (
        <GridItem key={item.id} item={item} lang={lang} />
      ))}
    </div>
  );
};

const GridItem = ({ item, lang }: { item: DashboardItem; lang: 'en' | 'ar' }) => {
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
    </div>
  );
};

const DragDropCustomization: React.FC<DragDropCustomizationProps> = ({ lang }) => {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([
    {
      id: 'charts',
      title: 'Price Charts',
      titleAr: 'الرسوم البيانية للأسعار',
      icon: <BarChart3 className="h-4 w-4 text-blue-400" />,
      visible: true,
      position: { x: 10, y: 10 },
      size: { width: 35, height: 40 }
    },
    {
      id: 'trends',
      title: 'Trend Analysis',
      titleAr: 'تحليل الاتجاهات',
      icon: <TrendingUp className="h-4 w-4 text-green-400" />,
      visible: true,
      position: { x: 50, y: 10 },
      size: { width: 35, height: 40 }
    },
    {
      id: 'portfolio',
      title: 'Portfolio Overview',
      titleAr: 'نظرة عامة على المحفظة',
      icon: <PieChart className="h-4 w-4 text-purple-400" />,
      visible: true,
      position: { x: 10, y: 55 },
      size: { width: 35, height: 35 }
    },
    {
      id: 'activity',
      title: 'Market Activity',
      titleAr: 'نشاط السوق',
      icon: <Activity className="h-4 w-4 text-yellow-400" />,
      visible: false,
      position: { x: 50, y: 55 },
      size: { width: 35, height: 35 }
    }
  ]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setDashboardItems(prevItems => {
      const newItems = [...prevItems];
      const draggedItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      return newItems;
    });
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setDashboardItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  }, []);

  const handleItemMove = useCallback((id: string, position: { x: number; y: number }) => {
    setDashboardItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, position } : item
      )
    );
  }, []);

  const resetLayout = () => {
    setDashboardItems(prevItems =>
      prevItems.map((item, index) => ({
        ...item,
        position: {
          x: (index % 2) * 45 + 10,
          y: Math.floor(index / 2) * 45 + 10
        },
        visible: true
      }))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {lang === 'ar' ? 'تخصيص لوحة التحكم' : 'Dashboard Customization'}
            </CardTitle>
            <Button onClick={resetLayout} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'إعادة تعيين' : 'Reset Layout'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {lang === 'ar' ? 'عناصر لوحة التحكم' : 'Dashboard Elements'}
              </h3>
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
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {lang === 'ar' ? 'معاينة التخطيط' : 'Layout Preview'}
              </h3>
              <GridLayout
                items={dashboardItems}
                onItemMove={handleItemMove}
                lang={lang}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </DndProvider>
  );
};

export default DragDropCustomization;
