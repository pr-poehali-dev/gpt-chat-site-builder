import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired';
  connectedSite?: string;
}

const Domains = () => {
  const [searchDomain, setSearchDomain] = useState('');
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'myawesomesite.com',
      status: 'active',
      connectedSite: 'AI Landing Page',
    },
    {
      id: '2',
      name: 'portfolio-designer.ru',
      status: 'pending',
    },
  ]);

  const checkDomain = () => {
    if (!searchDomain.trim()) return;
    console.log('Проверка домена:', searchDomain);
  };

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Управление <span className="gradient-text">Доменами</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Подключайте свои домены и публикуйте сайты
          </p>
        </div>

        <Card className="glass-effect p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Найти новый домен</h2>
          <div className="flex gap-4">
            <Input
              value={searchDomain}
              onChange={(e) => setSearchDomain(e.target.value)}
              placeholder="Введите желаемое доменное имя..."
              className="glass-effect border-white/10 text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  checkDomain();
                }
              }}
            />
            <Button
              onClick={checkDomain}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-8"
            >
              <Icon name="Search" size={20} className="mr-2" />
              Проверить
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {['.com', '.ru', '.net', '.org'].map((zone) => (
              <Button
                key={zone}
                variant="outline"
                size="sm"
                onClick={() => setSearchDomain((prev) => prev.replace(/\.\w+$/, '') + zone)}
                className="glass-effect border-white/10"
              >
                {zone}
              </Button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Мои домены</h2>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить домен
            </Button>
          </div>

          <div className="space-y-4">
            {domains.map((domain) => (
              <Card key={domain.id} className="glass-effect p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Icon name="Globe" size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{domain.name}</h3>
                        <Badge
                          variant={domain.status === 'active' ? 'default' : 'secondary'}
                          className={
                            domain.status === 'active'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }
                        >
                          {domain.status === 'active' ? 'Активен' : 'Ожидает'}
                        </Badge>
                      </div>
                      {domain.connectedSite && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Подключён к: {domain.connectedSite}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="glass-effect border-white/10">
                      <Icon name="Settings" size={16} className="mr-2" />
                      Настроить
                    </Button>
                    <Button variant="outline" size="sm" className="glass-effect border-white/10">
                      <Icon name="ExternalLink" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="glass-effect p-8 mt-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Info" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Как подключить домен?</h3>
              <ol className="space-y-2 text-muted-foreground">
                <li>1. Найдите и зарегистрируйте нужный домен</li>
                <li>2. Добавьте его в настройках вашего проекта</li>
                <li>3. Настройте DNS-записи у вашего регистратора</li>
                <li>4. Дождитесь активации (обычно 5-15 минут)</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Domains;
