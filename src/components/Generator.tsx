import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface GeneratedSite {
  html: string;
  css: string;
  js: string;
  metadata: {
    generatedAt: string;
    description: string;
    framework: string;
    status: string;
  };
}

const Generator = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Привет! Я AI-генератор сайтов. Опишите, какой сайт вы хотите создать, и я сгенерирую его для вас.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSite, setGeneratedSite] = useState<GeneratedSite | null>(null);
  const [previewTab, setPreviewTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [ownerKey, setOwnerKey] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState('');
  const [pages, setPages] = useState<string[]>([]);
  const [awaitingPages, setAwaitingPages] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const userInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    if (!awaitingPages) {
      const questionMessage: Message = {
        role: 'ai',
        content: 'Отлично! Сколько страниц должно быть на сайте? Например: Главная, О нас, Контакты',
      };
      setMessages((prev) => [...prev, questionMessage]);
      setAwaitingPages(true);
      return;
    }

    const pagesList = userInput.split(',').map(p => p.trim()).filter(p => p);
    setPages(pagesList);
    setAwaitingPages(false);
    setIsGenerating(true);
    setPublishedUrl(null);

    const aiMessage: Message = {
      role: 'ai',
      content: `Генерирую сайт с страницами: ${pagesList.join(', ')}\n\n⚡ Создаю структуру...\n🎨 Применяю дизайн...\n✨ Добавляю навигацию...`,
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const prevMessages = messages.filter(m => m.role === 'user').slice(-2);
      const description = prevMessages[0]?.content || userInput;
      
      const response = await fetch('https://functions.poehali.dev/6a39d8fd-078a-470e-bca3-92925135eded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, pages: pagesList }),
      });

      const data = await response.json();
      setGeneratedSite(data);

      const successMessage: Message = {
        role: 'ai',
        content: `✅ Готово! Сайт с ${pagesList.length} страницами создан. Посмотрите превью справа →`,
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'ai',
        content: '❌ Произошла ошибка. Попробуйте ещё раз.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedSite) return;

    setIsPublishing(true);

    try {
      const response = await fetch('https://functions.poehali.dev/0b559006-df15-4d38-89d9-6357a67c2c84', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedSite.metadata.description,
          description: generatedSite.metadata.description,
          html_content: generatedSite.html,
          css_content: generatedSite.css,
          js_content: generatedSite.js,
          custom_domain: customDomain || null,
          pages: generatedSite.pages || [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOwnerKey(data.owner_key);
        localStorage.setItem('ownerKey', data.owner_key);
        setPublishedUrl(data.url);

        const successMessage: Message = {
          role: 'ai',
          content: `🎉 Сайт опубликован!\n\n📎 Ссылка: ${data.url}\n🔑 Ключ владельца: ${data.owner_key}\n\nСохраните ключ - он нужен для редактирования!`,
        };
        setMessages((prev) => [...prev, successMessage]);

        toast({
          title: 'Сайт опубликован!',
          description: 'Ключ владельца сохранён',
        });

        navigator.clipboard.writeText(data.url);
      }
    } catch (error) {
      toast({
        title: 'Ошибка публикации',
        description: 'Попробуйте ещё раз',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
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
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
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
                  <div className="flex justify-start animate-fade-in">
                    <div className="glass-effect rounded-2xl px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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

          <Card className="glass-effect p-6 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Icon name="Monitor" size={20} className="text-primary" />
                <span className="font-semibold">Превью</span>
              </div>
              {generatedSite && (
                <div className="flex gap-2 items-center">
                  {!publishedUrl && (
                    <Input
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="example.com (опционально)"
                      className="glass-effect border-white/10 w-48 h-8 text-sm"
                    />
                  )}
                  {publishedUrl ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-effect border-white/10"
                      onClick={() => window.open(publishedUrl, '_blank')}
                    >
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      Открыть сайт
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={handlePublish}
                      disabled={isPublishing}
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      {isPublishing ? 'Публикуем...' : 'Опубликовать'}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {generatedSite ? (
              <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as typeof previewTab)} className="flex-1 flex flex-col">
                <TabsList className="glass-effect border-white/10 mb-4">
                  <TabsTrigger value="preview">Превью</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JS</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="flex-1 mt-0">
                  <div className="h-full bg-white rounded-lg overflow-hidden animate-fade-in">
                    <iframe
                      srcDoc={`${generatedSite.html}<style>${generatedSite.css}</style><script>${generatedSite.js}</script>`}
                      className="w-full h-full"
                      title="Preview"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="html" className="flex-1 mt-0 overflow-hidden">
                  <div className="h-full bg-black/30 rounded-lg p-4 overflow-auto animate-fade-in">
                    <pre className="text-sm text-green-400 font-mono">{generatedSite.html}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="css" className="flex-1 mt-0 overflow-hidden">
                  <div className="h-full bg-black/30 rounded-lg p-4 overflow-auto animate-fade-in">
                    <pre className="text-sm text-blue-400 font-mono">{generatedSite.css}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="js" className="flex-1 mt-0 overflow-hidden">
                  <div className="h-full bg-black/30 rounded-lg p-4 overflow-auto animate-fade-in">
                    <pre className="text-sm text-yellow-400 font-mono">{generatedSite.js}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Icon name="Layout" size={64} className="text-primary/50 mx-auto" />
                  <p className="text-muted-foreground">
                    Здесь появится превью вашего сайта
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Generator;