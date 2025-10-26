import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const Generator = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Привет! Я AI-генератор сайтов. Опишите, какой сайт вы хотите создать, и я сгенерирую его для вас.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    setTimeout(() => {
      const aiMessage: Message = {
        role: 'ai',
        content: `Отлично! Я создаю сайт на основе вашего описания: "${input}". 
        
Сайт будет включать:
• Современный дизайн с градиентами
• Адаптивную вёрстку для всех устройств
• Оптимизированную производительность
• SEO-оптимизацию

Генерация займёт около 30 секунд...`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            AI Генератор <span className="gradient-text">Сайтов</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Опишите ваш проект — получите готовый сайт
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="glass-effect p-6 h-[500px] flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={18} className="text-white" />
                </div>
                <span className="font-semibold">AI Ассистент</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'glass-effect'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="glass-effect rounded-2xl px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Опишите ваш сайт..."
                  className="resize-none glass-effect border-white/10"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={isGenerating || !input.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </Card>

            <div className="flex gap-2 flex-wrap">
              {[
                'Лендинг для стартапа',
                'Портфолио дизайнера',
                'Интернет-магазин',
                'Блог о технологиях',
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(example)}
                  className="glass-effect border-white/10"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <Card className="glass-effect p-6 h-[600px]">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Icon name="Monitor" size={20} className="text-primary" />
                <span className="font-semibold">Превью</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Smartphone" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Tablet" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Monitor" size={16} />
                </Button>
              </div>
            </div>

            <div className="h-[calc(100%-60px)] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Icon name="Layout" size={64} className="text-primary/50 mx-auto" />
                <p className="text-muted-foreground">
                  Здесь появится превью вашего сайта
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Generator;
