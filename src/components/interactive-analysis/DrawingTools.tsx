
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Pencil, 
  Square, 
  Circle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RotateCcw, 
  Download,
  Palette,
  MousePointer,
  Triangle,
  Grid3X3,
  Ruler
} from 'lucide-react';

interface DrawingToolsProps {
  lang: 'en' | 'ar';
  chartData?: any[];
}

interface DrawingTool {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ReactElement;
  type: 'select' | 'draw' | 'line' | 'rectangle' | 'circle' | 'trendline' | 'resistance' | 'support' | 'fibonacci' | 'triangle';
}

interface DrawnObject {
  id: string;
  type: string;
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
  completed: boolean;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ lang, chartData = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedColor, setSelectedColor] = useState('#00FF88');
  const [lineWidth, setLineWidth] = useState(2);
  const [drawnObjects, setDrawnObjects] = useState<DrawnObject[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [showGrid, setShowGrid] = useState(true);

  const tools: DrawingTool[] = [
    {
      id: 'select',
      name: 'Select',
      nameAr: 'تحديد',
      icon: <MousePointer className="h-4 w-4" />,
      type: 'select'
    },
    {
      id: 'pen',
      name: 'Free Draw',
      nameAr: 'رسم حر',
      icon: <Pencil className="h-4 w-4" />,
      type: 'draw'
    },
    {
      id: 'line',
      name: 'Line',
      nameAr: 'خط',
      icon: <Minus className="h-4 w-4" />,
      type: 'line'
    },
    {
      id: 'rectangle',
      name: 'Rectangle',
      nameAr: 'مستطيل',
      icon: <Square className="h-4 w-4" />,
      type: 'rectangle'
    },
    {
      id: 'circle',
      name: 'Circle',
      nameAr: 'دائرة',
      icon: <Circle className="h-4 w-4" />,
      type: 'circle'
    },
    {
      id: 'triangle',
      name: 'Triangle',
      nameAr: 'مثلث',
      icon: <Triangle className="h-4 w-4" />,
      type: 'triangle'
    },
    {
      id: 'trendline',
      name: 'Trend Line',
      nameAr: 'خط الاتجاه',
      icon: <TrendingUp className="h-4 w-4" />,
      type: 'trendline'
    },
    {
      id: 'resistance',
      name: 'Resistance',
      nameAr: 'مقاومة',
      icon: <TrendingDown className="h-4 w-4" />,
      type: 'resistance'
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci',
      nameAr: 'فيبوناتشي',
      icon: <Ruler className="h-4 w-4" />,
      type: 'fibonacci'
    }
  ];

  const colors = [
    '#00FF88', '#FF4444', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
  ];

  useEffect(() => {
    redrawCanvas();
  }, [drawnObjects, showGrid, chartData]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas);
    }

    // Draw chart background (simulated)
    drawChartBackground(ctx, canvas);

    // Draw all objects
    drawnObjects.forEach(obj => {
      drawObject(ctx, obj);
    });

    // Draw current path if drawing
    if (isDrawing && currentPath.length > 0) {
      drawCurrentPath(ctx);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    const gridSize = 20;
    
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };

  const drawChartBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Simulate a simple price chart
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const points = 50;
    for (let i = 0; i < points; i++) {
      const x = (i / points) * canvas.width;
      const y = canvas.height * 0.3 + Math.sin(i * 0.2) * 50 + Math.random() * 20;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawObject = (ctx: CanvasRenderingContext2D, obj: DrawnObject) => {
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = obj.lineWidth;
    ctx.beginPath();

    switch (obj.type) {
      case 'draw':
        if (obj.points.length > 1) {
          ctx.moveTo(obj.points[0].x, obj.points[0].y);
          obj.points.forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
        }
        break;

      case 'line':
      case 'trendline':
      case 'resistance':
        if (obj.points.length >= 2) {
          ctx.moveTo(obj.points[0].x, obj.points[0].y);
          ctx.lineTo(obj.points[1].x, obj.points[1].y);
        }
        break;

      case 'rectangle':
        if (obj.points.length >= 2) {
          const width = obj.points[1].x - obj.points[0].x;
          const height = obj.points[1].y - obj.points[0].y;
          ctx.rect(obj.points[0].x, obj.points[0].y, width, height);
        }
        break;

      case 'circle':
        if (obj.points.length >= 2) {
          const centerX = obj.points[0].x;
          const centerY = obj.points[0].y;
          const radius = Math.sqrt(
            Math.pow(obj.points[1].x - centerX, 2) + 
            Math.pow(obj.points[1].y - centerY, 2)
          );
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        }
        break;

      case 'triangle':
        if (obj.points.length >= 3) {
          ctx.moveTo(obj.points[0].x, obj.points[0].y);
          ctx.lineTo(obj.points[1].x, obj.points[1].y);
          ctx.lineTo(obj.points[2].x, obj.points[2].y);
          ctx.closePath();
        }
        break;

      case 'fibonacci':
        if (obj.points.length >= 2) {
          const startY = obj.points[0].y;
          const endY = obj.points[1].y;
          const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
          
          levels.forEach(level => {
            const y = startY + (endY - startY) * level;
            ctx.moveTo(obj.points[0].x, y);
            ctx.lineTo(obj.points[1].x, y);
            
            // Add level text
            ctx.fillStyle = obj.color;
            ctx.font = '12px Arial';
            ctx.fillText(`${(level * 100).toFixed(1)}%`, obj.points[1].x + 5, y);
          });
        }
        break;
    }

    ctx.stroke();
  };

  const drawCurrentPath = (ctx: CanvasRenderingContext2D) => {
    if (currentPath.length === 0) return;

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();

    if (selectedTool === 'pen') {
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
    } else if (currentPath.length >= 2) {
      const start = currentPath[0];
      const current = currentPath[currentPath.length - 1];

      switch (selectedTool) {
        case 'line':
        case 'trendline':
        case 'resistance':
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(current.x, current.y);
          break;

        case 'rectangle':
          const width = current.x - start.x;
          const height = current.y - start.y;
          ctx.rect(start.x, start.y, width, height);
          break;

        case 'circle':
          const radius = Math.sqrt(
            Math.pow(current.x - start.x, 2) + 
            Math.pow(current.y - start.y, 2)
          );
          ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
          break;
      }
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'select') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'pen') {
      setCurrentPath(prev => [...prev, { x, y }]);
    } else {
      setCurrentPath(prev => [prev[0], { x, y }]);
    }

    redrawCanvas();
  };

  const handleMouseUp = () => {
    if (!isDrawing || currentPath.length === 0) return;

    const newObject: DrawnObject = {
      id: Date.now().toString(),
      type: selectedTool,
      points: [...currentPath],
      color: selectedColor,
      lineWidth: lineWidth,
      completed: true
    };

    setDrawnObjects(prev => [...prev, newObject]);
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearCanvas = () => {
    setDrawnObjects([]);
    redrawCanvas();
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'chart-analysis.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const undoLastAction = () => {
    setDrawnObjects(prev => prev.slice(0, -1));
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Pencil className="h-5 w-5" />
          {lang === 'ar' ? 'أدوات الرسم والتحليل' : 'Drawing & Analysis Tools'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tools Toolbar */}
        <div className="flex flex-wrap gap-2 p-3 bg-gray-800 rounded-lg">
          {tools.map(tool => (
            <Button
              key={tool.id}
              size="sm"
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              onClick={() => setSelectedTool(tool.id)}
              className="flex items-center gap-2"
            >
              {tool.icon}
              <span className="hidden md:inline">
                {lang === 'ar' ? tool.nameAr : tool.name}
              </span>
            </Button>
          ))}
        </div>

        {/* Color and Settings */}
        <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {lang === 'ar' ? 'اللون:' : 'Color:'}
            </span>
            <div className="flex gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedColor === color ? 'border-white' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {lang === 'ar' ? 'سُمك الخط:' : 'Line Width:'}
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20"
            />
            <Badge variant="secondary">{lineWidth}px</Badge>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            {showGrid ? (lang === 'ar' ? 'إخفاء الشبكة' : 'Hide Grid') : (lang === 'ar' ? 'إظهار الشبكة' : 'Show Grid')}
          </Button>
        </div>

        {/* Canvas */}
        <div className="relative border border-gray-700 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full cursor-crosshair bg-gray-900"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={undoLastAction} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'تراجع' : 'Undo'}
          </Button>
          
          <Button onClick={clearCanvas} variant="outline" size="sm">
            <Square className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
          </Button>

          <Button onClick={exportCanvas} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'تصدير' : 'Export'}
          </Button>

          <div className="flex-1" />

          <Badge variant="secondary">
            {lang === 'ar' ? `عدد الكائنات: ${drawnObjects.length}` : `Objects: ${drawnObjects.length}`}
          </Badge>
        </div>

        {/* Drawing Instructions */}
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-sm font-medium text-blue-400 mb-2">
            {lang === 'ar' ? 'تعليمات الرسم:' : 'Drawing Instructions:'}
          </h4>
          <ul className="text-xs text-blue-300 space-y-1">
            <li>• {lang === 'ar' ? 'اختر أداة من شريط الأدوات' : 'Select a tool from the toolbar'}</li>
            <li>• {lang === 'ar' ? 'انقر واسحب لرسم الأشكال' : 'Click and drag to draw shapes'}</li>
            <li>• {lang === 'ar' ? 'استخدم فيبوناتشي لتحليل مستويات الدعم والمقاومة' : 'Use Fibonacci for support/resistance analysis'}</li>
            <li>• {lang === 'ar' ? 'خطوط الاتجاه تساعد في تحديد اتجاه السوق' : 'Trend lines help identify market direction'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawingTools;
