
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';

interface VoiceControlProps {
  lang?: 'en' | 'ar';
}

const VoiceControl = ({ lang = 'en' }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptResult = event.results[current][0].transcript;
      const confidenceScore = event.results[current][0].confidence;
      
      setTranscript(transcriptResult);
      setConfidence(confidenceScore);
      
      // Process voice commands
      processVoiceCommand(transcriptResult);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isSupported, lang]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Voice command patterns
    const commands = {
      buy: ['شراء', 'اشتري', 'buy', 'purchase'],
      sell: ['بيع', 'بع', 'sell'],
      price: ['سعر', 'price', 'quote'],
      portfolio: ['محفظة', 'portfolio', 'holdings'],
      chart: ['رسم', 'chart', 'graph']
    };

    // Check for commands and execute actions
    Object.entries(commands).forEach(([action, keywords]) => {
      if (keywords.some(keyword => lowerCommand.includes(keyword))) {
        executeVoiceCommand(action, command);
      }
    });
  };

  const executeVoiceCommand = (action: string, fullCommand: string) => {
    console.log(`Executing voice command: ${action} - ${fullCommand}`);
    
    // Here you would integrate with your trading system
    speak(lang === 'ar' ? `تم تنفيذ الأمر: ${action}` : `Executing command: ${action}`);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MicOff className="h-5 w-5 text-gray-500" />
            {lang === 'ar' ? 'التحكم الصوتي غير مدعوم' : 'Voice Control Not Supported'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'متصفحك لا يدعم التحكم الصوتي. يرجى استخدام متصفح Chrome أو Safari.'
              : 'Your browser does not support voice control. Please use Chrome or Safari.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'التحكم الصوتي المتقدم' : 'Advanced Voice Control'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isListening 
                ? (lang === 'ar' ? 'إيقاف الاستماع' : 'Stop Listening')
                : (lang === 'ar' ? 'بدء الاستماع' : 'Start Listening')
              }
            </Button>

            <Button
              onClick={isSpeaking ? stopSpeaking : () => speak(lang === 'ar' ? 'مرحباً بك في منصة التداول الذكي' : 'Welcome to AI Trading Platform')}
              variant="outline"
              className="border-gray-600"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              {isSpeaking 
                ? (lang === 'ar' ? 'إيقاف النطق' : 'Stop Speaking')
                : (lang === 'ar' ? 'اختبار النطق' : 'Test Speech')
              }
            </Button>

            <Badge 
              variant={isListening ? "default" : "secondary"}
              className={isListening ? 'bg-green-600 animate-pulse' : 'bg-gray-600'}
            >
              {isListening 
                ? (lang === 'ar' ? 'جاري الاستماع...' : 'Listening...')
                : (lang === 'ar' ? 'متوقف' : 'Stopped')
              }
            </Badge>
          </div>

          {transcript && (
            <div className="p-3 bg-trading-secondary rounded-lg">
              <div className="text-sm text-gray-400 mb-1">
                {lang === 'ar' ? 'النص المسموع:' : 'Transcript:'}
              </div>
              <div className="text-white">{transcript}</div>
              {confidence > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {lang === 'ar' ? 'الثقة:' : 'Confidence:'} {(confidence * 100).toFixed(0)}%
                </div>
              )}
            </div>
          )}

          <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-700">
            <h4 className="text-blue-300 font-medium mb-2">
              {lang === 'ar' ? 'الأوامر الصوتية المتاحة:' : 'Available Voice Commands:'}
            </h4>
            <div className="space-y-1 text-sm text-blue-200">
              {lang === 'ar' ? (
                <>
                  <div>• "شراء بيتكوين" - لشراء العملات</div>
                  <div>• "بيع إيثريوم" - لبيع العملات</div>
                  <div>• "سعر الذهب" - للاستعلام عن الأسعار</div>
                  <div>• "عرض المحفظة" - لعرض المحفظة</div>
                  <div>• "إظهار الرسم البياني" - لعرض الرسوم</div>
                </>
              ) : (
                <>
                  <div>• "Buy Bitcoin" - to purchase cryptocurrencies</div>
                  <div>• "Sell Ethereum" - to sell cryptocurrencies</div>
                  <div>• "Gold price" - to get price quotes</div>
                  <div>• "Show portfolio" - to display portfolio</div>
                  <div>• "Display chart" - to show charts</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceControl;
