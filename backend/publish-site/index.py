import json
import os
import uuid
import re
from typing import Dict, Any
from pydantic import BaseModel, Field
import psycopg

class PublishRequest(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    html_content: str = Field(..., min_length=1)
    css_content: str = Field(..., min_length=1)
    js_content: str = Field(..., min_length=1)

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
    
    with psycopg.connect(database_url, autocommit=True) as conn:
        with conn.cursor() as cur:
            query = f"""
                INSERT INTO websites (id, title, description, html_content, css_content, js_content, slug, published)
                VALUES ('{website_id}', '{request_data.title.replace("'", "''")}', '{request_data.description.replace("'", "''")}', 
                        '{request_data.html_content.replace("'", "''")}', '{request_data.css_content.replace("'", "''")}', 
                        '{request_data.js_content.replace("'", "''")}', '{slug}', true)
            """
            cur.execute(query)
    
    public_url = f"https://your-domain.com/site/{slug}"
    
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
            'url': public_url,
            'message': 'Сайт успешно опубликован!'
        })
    }