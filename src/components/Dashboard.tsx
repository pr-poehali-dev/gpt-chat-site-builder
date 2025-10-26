import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Website {
  id: string;
  title: string;
  slug: string;
  custom_domain: string | null;
  created_at: string;
  url: string;
  pages: any[];
}

const Dashboard = () => {
  const { toast } = useToast();
  const [ownerKey, setOwnerKey] = useState('');
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedSite, setSelectedSite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('ownerKey');
    if (savedKey) {
      setOwnerKey(savedKey);
      loadWebsites(savedKey);
    }
  }, []);

  const loadWebsites = async (key: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/6f021db9-211a-446c-a77c-dbf53e721ac0?owner_key=${key}`
      );
      const data = await response.json();
      setWebsites(data.websites || []);
      localStorage.setItem('ownerKey', key);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить сайты',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCode = async () => {
    if (!selectedSite) return;

    setIsSaving(true);
    try {
      const response = await fetch('https://functions.poehali.dev/1e64ab20-ec4a-4963-ba58-2c4a09e3a872', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_key: ownerKey,
          slug: selectedSite.slug,
          html_content: htmlCode,
          css_content: cssCode,
          js_content: jsCode,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Сохранено!',
          description: 'Изменения успешно применены',
        });
        setEditMode(false);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadSiteCode = async (site: Website) => {
    setSelectedSite(site);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/5dd0b84c-6c65-4ef4-bbf3-57de039b0294?slug=${site.slug}`
      );
      const html = await response.text();
      
      const htmlMatch = html.match(/<body>([\s\S]*?)<\/body>/);
      const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
      const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/);

      setHtmlCode(htmlMatch ? htmlMatch[1] : '');
      setCssCode(cssMatch ? cssMatch[1] : '');
      setJsCode(jsMatch ? jsMatch[1] : '');
      setEditMode(true);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить код сайта',
        variant: 'destructive',
      });
    }
  };

  if (!ownerKey || websites.length === 0) {
    return (
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <Card className="glass-effect p-8">
            <h2 className="text-2xl font-bold mb-4">Панель управления</h2>
            <p className="text-muted-foreground mb-6">
              Введите ключ владельца для доступа к вашим сайтам
            </p>
            <div className="space-y-4">
              <Input
                value={ownerKey}
                onChange={(e) => setOwnerKey(e.target.value)}
                placeholder="Введите ключ владельца..."
                className="glass-effect border-white/10"
              />
              <Button
                onClick={() => loadWebsites(ownerKey)}
                disabled={isLoading || !ownerKey.trim()}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isLoading ? 'Загрузка...' : 'Войти'}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (editMode && selectedSite) {
    return (
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{selectedSite.title}</h1>
              <p className="text-muted-foreground">{selectedSite.url}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="glass-effect border-white/10"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
              <Button
                onClick={handleSaveCode}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Icon name="Save" size={16} className="mr-2" />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="html" className="space-y-4">
            <TabsList className="glass-effect border-white/10">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="preview">Превью</TabsTrigger>
            </TabsList>

            <TabsContent value="html">
              <Card className="glass-effect p-0 overflow-hidden">
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="min-h-[600px] font-mono text-sm glass-effect border-0 resize-none"
                  placeholder="HTML код..."
                />
              </Card>
            </TabsContent>

            <TabsContent value="css">
              <Card className="glass-effect p-0 overflow-hidden">
                <Textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="min-h-[600px] font-mono text-sm glass-effect border-0 resize-none"
                  placeholder="CSS код..."
                />
              </Card>
            </TabsContent>

            <TabsContent value="js">
              <Card className="glass-effect p-0 overflow-hidden">
                <Textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="min-h-[600px] font-mono text-sm glass-effect border-0 resize-none"
                  placeholder="JavaScript код..."
                />
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card className="glass-effect p-4 h-[600px]">
                <iframe
                  srcDoc={`<!DOCTYPE html><html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}</script></body></html>`}
                  className="w-full h-full bg-white rounded"
                  title="Preview"
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            Мои <span className="gradient-text">сайты</span>
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('ownerKey');
              setOwnerKey('');
              setWebsites([]);
            }}
            className="glass-effect border-white/10"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>

        <div className="space-y-4">
          {websites.map((site) => (
            <Card key={site.id} className="glass-effect p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{site.title}</h3>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {site.url}
                    <Icon name="ExternalLink" size={14} />
                  </a>
                  {site.custom_domain && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Домен: {site.custom_domain}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => loadSiteCode(site)}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Icon name="Code" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
