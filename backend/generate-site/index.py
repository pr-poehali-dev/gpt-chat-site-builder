import json
from typing import Dict, Any, List
from pydantic import BaseModel, Field

class GenerateRequest(BaseModel):
    description: str = Field(..., min_length=1)
    pages: List[str] = []

def generate_multipage_site(description: str, pages: List[str]) -> Dict[str, Any]:
    if not pages:
        pages = ['Главная']
    
    nav_items = ''.join([f'<a href="#{page.lower().replace(" ", "-")}" class="nav-link">{page}</a>' for page in pages])
    
    page_sections = ''
    for idx, page in enumerate(pages):
        page_sections += f'''
    <section id="{page.lower().replace(" ", "-")}" class="page-section {'active' if idx == 0 else ''}">
        <div class="content">
            <h1>{page}</h1>
            <p>Раздел: {page}</p>
            <p>{description}</p>
            <div class="feature-grid">
                <div class="feature-card">
                    <span class="icon">⚡</span>
                    <h3>Быстро</h3>
                    <p>Мгновенная загрузка</p>
                </div>
                <div class="feature-card">
                    <span class="icon">🎨</span>
                    <h3>Красиво</h3>
                    <p>Современный дизайн</p>
                </div>
                <div class="feature-card">
                    <span class="icon">📱</span>
                    <h3>Адаптивно</h3>
                    <p>Для всех устройств</p>
                </div>
            </div>
        </div>
    </section>'''
    
    html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{pages[0] if pages else "Generated Site"}</title>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">AI Site</div>
            <div class="nav-menu">
                {nav_items}
            </div>
        </div>
    </nav>
    {page_sections}
    <footer>
        <p>© 2024 AI Builder</p>
    </footer>
</body>
</html>'''
    
    css = '''* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #1a1f2c 0%, #2d1f3d 100%);
    color: #fff;
    min-height: 100vh;
}

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(26, 31, 44, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1000;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-menu {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;
    opacity: 0.8;
}

.nav-link:hover {
    opacity: 1;
    color: #8b5cf6;
}

.page-section {
    display: none;
    min-height: 100vh;
    padding: 120px 20px 80px;
}

.page-section.active {
    display: block;
}

.content {
    max-width: 1200px;
    margin: 0 auto;
}

.content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.content > p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 3rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.feature-card p {
    opacity: 0.8;
}

footer {
    text-align: center;
    padding: 40px 20px;
    opacity: 0.7;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
    .nav-menu {
        gap: 1rem;
    }
    
    .content h1 {
        font-size: 2rem;
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
    }
}'''
    
    js = '''document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeIn 0.5s ease-out forwards';
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);'''
    
    return {
        'html': html,
        'css': css,
        'js': js,
        'pages': [{'name': page, 'html': '', 'route': f"#{page.lower().replace(' ', '-')}"} for page in pages],
        'metadata': {
            'generatedAt': 'now',
            'description': description,
            'framework': 'vanilla',
            'status': 'ready',
            'pageCount': len(pages)
        }
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate multi-page website code based on user description
    Args: event with httpMethod, body; context with request_id
    Returns: Generated HTML/CSS/JS code structure with multiple pages
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    request_data = GenerateRequest(**body_data)
    
    result = generate_multipage_site(request_data.description, request_data.pages)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(result)
    }
