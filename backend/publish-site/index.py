import json
import os
import uuid
import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import psycopg

class PageData(BaseModel):
    name: str
    html: str
    route: str

class PublishRequest(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    html_content: str = Field(..., min_length=1)
    css_content: str = Field(..., min_length=1)
    js_content: str = Field(..., min_length=1)
    custom_domain: Optional[str] = None
    pages: List[PageData] = []

def generate_slug(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9а-я\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = slug[:50]
    return f"{slug}-{str(uuid.uuid4())[:8]}"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Publish generated website to database and get public URL
    Args: event with httpMethod, body; context with request_id
    Returns: Published website URL and metadata
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
    request_data = PublishRequest(**body_data)
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    website_id = str(uuid.uuid4())
    slug = generate_slug(request_data.title)
    owner_key = str(uuid.uuid4())
    
    pages_json = json.dumps([p.dict() for p in request_data.pages]) if request_data.pages else '[]'
    
    title_esc = request_data.title.replace("'", "''")
    desc_esc = request_data.description.replace("'", "''")
    html_esc = request_data.html_content.replace("'", "''")
    css_esc = request_data.css_content.replace("'", "''")
    js_esc = request_data.js_content.replace("'", "''")
    domain_esc = request_data.custom_domain.replace("'", "''") if request_data.custom_domain else 'NULL'
    
    with psycopg.connect(database_url, autocommit=True) as conn:
        with conn.cursor() as cur:
            if request_data.custom_domain:
                query = f"""
                    INSERT INTO websites (id, title, description, html_content, css_content, js_content, slug, published, owner_key, custom_domain, pages)
                    VALUES ('{website_id}', '{title_esc}', '{desc_esc}', '{html_esc}', '{css_esc}', '{js_esc}', '{slug}', true, '{owner_key}', '{domain_esc}', '{pages_json}')
                """
            else:
                query = f"""
                    INSERT INTO websites (id, title, description, html_content, css_content, js_content, slug, published, owner_key, pages)
                    VALUES ('{website_id}', '{title_esc}', '{desc_esc}', '{html_esc}', '{css_esc}', '{js_esc}', '{slug}', true, '{owner_key}', '{pages_json}')
                """
            cur.execute(query)
    
    if request_data.custom_domain:
        public_url = f"https://{request_data.custom_domain}"
    else:
        public_url = f"https://functions.poehali.dev/5dd0b84c-6c65-4ef4-bbf3-57de039b0294?slug={slug}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'website_id': website_id,
            'slug': slug,
            'owner_key': owner_key,
            'url': public_url,
            'message': 'Сайт успешно опубликован!'
        })
    }