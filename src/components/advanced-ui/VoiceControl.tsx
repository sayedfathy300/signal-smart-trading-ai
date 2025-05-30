
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceControlProps {
  lang: 'en' | 'ar';
  onCommand: (command: string, params?: any) => void;
}

interface VoiceCommand {
  pattern: RegExp;
  action: string;
  description: string;
  descriptionAr: string;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ lang, onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const voiceCommands: VoiceCommand[] = [
    {
      pattern: /show (dashboard|لوحة التحكم)/i,
      action: 'navigate',
      description: 'Navigate to dashboard',
      descriptionAr: 'الانتقال إلى لوحة التحكم'
    },
    {
      pattern: /buy (.*)|شراء (.*)/i,
      action: 'trade',
      description: 'Execute buy order',
      descriptionAr: 'تنفيذ أمر شراء'
    },
    {
      pattern: /sell (.*)|بيع (.*)/i,
      action: 'trade',
      description: 'Execute sell order',
      descriptionAr: 'تنفيذ أمر بيع'
    },
    {
      pattern: /analyze (.*)|تحليل (.*)/i,
      action: 'analyze',
      description: 'Start analysis',
      descriptionAr: 'بدء التحليل'
    },
    {
      pattern: /stop|توقف|إيقاف/i,
      action: 'stop',
      description: 'Stop current operation',
      descriptionAr: 'إيقاف العملية الحالية'
    },
    {
      pattern: /portfolio|محفظة/i,
      action: 'portfolio',
      description: 'Show portfolio',
      descriptionAr: 'عرض المحفظة'
    },
    {
      pattern: /export report|تصدير تقرير/i,
      action: 'export',
      description: 'Export trading report',
      descriptionAr: 'تصدير تقرير التداول'
    },
    {
      pattern: /help|مساعدة/i,
      action: 'help',
      description: 'Show voice commands',
      descriptionAr: 'عرض الأوامر الصوتية'
    }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        processVoiceCommand(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(lang === 'ar' ? 'خطأ في التعرف على الصوت' : 'Speech recognition error');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, [lang]);

  const processVoiceCommand = useCallback((transcript: string) => {
    setLastCommand(transcript);
    setCommandHistory(prev => [transcript, ...prev.slice(0, 9)]);
    
    for (const command of voiceCommands) {
      const match = transcript.match(command.pattern);
      if (match) {
        const params = match[1] ? { target: match[1] } : {};
        onCommand(command.action, params);
        
        const responseText = lang === 'ar' ? 
          `تم تنفيذ الأمر: ${command.descriptionAr}` :
          `Command executed: ${command.description}`;
        
        speak(responseText);
        toast.success(responseText);
        return;
      }
    }
    
    const errorText = lang === 'ar' ? 
      'لم يتم التعرف على الأمر. قل "مساعدة" لعرض الأوامر المتاحة' :
      'Command not recognized. Say "help" to see available commands';
    
    speak(errorText);
    toast.error(errorText);
  }, [lang, onCommand]);

  const speak = useCallback((text: string) => {
    if (synthesis) {
      synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthesis.speak(utterance);
    }
  }, [synthesis, lang]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
      toast.info(lang === 'ar' ? 'جاري الاستماع...' : 'Listening...');
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const showHelp = () => {
    const helpText = lang === 'ar' ? 
      'الأوامر المتاحة: لوحة التحكم، شراء، بيع، تحليل، محفظة، تصدير تقرير، توقف' :
      'Available commands: dashboard, buy, sell, analyze, portfolio, export report, stop';
    
    speak(helpText);
    toast.info(helpText);
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          {lang === 'ar' ? 'التحكم الصوتي' : 'Voice Control'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 
              (lang === 'ar' ? 'إيقاف الاستماع' : 'Stop Listening') :
              (lang === 'ar' ? 'بدء الاستماع' : 'Start Listening')
            }
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : showHelp}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? 
              (lang === 'ar' ? 'إيقاف الصوت' : 'Stop Speaking') :
              (lang === 'ar' ? 'المساعدة' : 'Help')
            }
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {lang === 'ar' ? 'الحالة:' : 'Status:'}
            </span>
            <Badge variant={isListening ? "default" : "secondary"}>
              {isListening ? 
                (lang === 'ar' ? 'يستمع' : 'Listening') :
                (lang === 'ar' ? 'متوقف' : 'Stopped')
              }
            </Badge>
          </div>
          
          {lastCommand && (
            <div className="p-2 bg-gray-800 rounded text-sm">
              <span className="text-gray-400">
                {lang === 'ar' ? 'آخر أمر:' : 'Last command:'}
              </span>
              <div className="text-white">{lastCommand}</div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-400">
            {lang === 'ar' ? 'الأوامر المتاحة:' : 'Available Commands:'}
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {voiceCommands.map((cmd, index) => (
              <div key={index} className="text-xs text-gray-500">
                {lang === 'ar' ? cmd.descriptionAr : cmd.description}
              </div>
            ))}
          </div>
        </div>

        {commandHistory.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-400">
              {lang === 'ar' ? 'سجل الأوامر:' : 'Command History:'}
            </h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {commandHistory.map((cmd, index) => (
                <div key={index} className="text-xs text-gray-600">
                  {cmd}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceControl;
