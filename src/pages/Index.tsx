import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Generator from '@/components/Generator';
import Domains from '@/components/Domains';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">AI Builder</span>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => setActiveTab('home')}>
              Главная
            </Button>
            <Button variant="ghost" onClick={() => setActiveTab('generator')}>
              Генератор
            </Button>
            <Button variant="ghost" onClick={() => setActiveTab('domains')}>
              Домены
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Начать
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {activeTab === 'home' && (
          <>
            <section className="container mx-auto px-6 py-24 text-center">
              <div className="animate-fade-in">
                <h1 className="text-6xl font-bold mb-6 leading-tight">
                  Создавайте сайты силой{' '}
                  <span className="gradient-text bg-size-200 animate-gradient-shift">
                    искусственного интеллекта
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Просто опишите, что вам нужно — и получите готовый сайт за считанные минуты
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8"
                    onClick={() => setActiveTab('generator')}
                  >
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Создать сайт
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <Icon name="Play" size={20} className="mr-2" />
                    Посмотреть демо
                  </Button>
                </div>
              </div>

              <div className="mt-20 animate-scale-in">
                <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Monitor" size={80} className="text-primary/50" />
                  </div>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-6 py-24">
              <h2 className="text-4xl font-bold text-center mb-16">Возможности платформы</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="glass-effect p-8 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Zap" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Мгновенная генерация</h3>
                  <p className="text-muted-foreground">
                    AI создаёт полноценные сайты за секунды на основе вашего описания
                  </p>
                </Card>

                <Card className="glass-effect p-8 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Code" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Чистый код</h3>
                  <p className="text-muted-foreground">
                    Современный React, TypeScript и Tailwind CSS под капотом
                  </p>
                </Card>

                <Card className="glass-effect p-8 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Globe" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Собственный домен</h3>
                  <p className="text-muted-foreground">
                    Подключайте свои домены и публикуйте сайты мгновенно
                  </p>
                </Card>
              </div>
            </section>

            <section className="container mx-auto px-6 py-24">
              <div className="glass-effect rounded-2xl p-12 text-center">
                <h2 className="text-4xl font-bold mb-6">Готовы создать свой первый сайт?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Присоединяйтесь к тысячам создателей, которые уже используют AI Builder
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-12"
                  onClick={() => setActiveTab('generator')}
                >
                  Начать бесплатно
                </Button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'generator' && <Generator />}
        {activeTab === 'domains' && <Domains />}
      </main>

      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <span className="font-bold">AI Builder</span>
            </div>
            <p className="text-muted-foreground">© 2024 AI Builder. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
