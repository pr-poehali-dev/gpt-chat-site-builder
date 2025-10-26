import json
import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import psycopg

class PageData(BaseModel):
    name: str
    html: str
    route: str

class UpdateRequest(BaseModel):
    owner_key: str = Field(..., min_length=1)
    slug: str = Field(..., min_length=1)
    html_content: Optional[str] = None
    css_content: Optional[str] = None
    js_content: Optional[str] = None
    title: Optional[str] = None
    pages: Optional[List[PageData]] = None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Update website content by owner key
    Args: event with httpMethod, body; context with request_id
    Returns: Updated website metadata
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'PUT':
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
    request_data = UpdateRequest(**body_data)
    
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
    
    owner_esc = request_data.owner_key.replace("'", "''")
    slug_esc = request_data.slug.replace("'", "''")
    
    with psycopg.connect(database_url, autocommit=True) as conn:
        with conn.cursor() as cur:
            check_query = f"SELECT id FROM websites WHERE slug = '{slug_esc}' AND owner_key = '{owner_esc}'"
            cur.execute(check_query)
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Access denied or website not found'})
                }
            
            updates = []
            if request_data.html_content:
                html_esc = request_data.html_content.replace("'", "''")
                updates.append(f"html_content = '{html_esc}'")
            if request_data.css_content:
                css_esc = request_data.css_content.replace("'", "''")
                updates.append(f"css_content = '{css_esc}'")
            if request_data.js_content:
                js_esc = request_data.js_content.replace("'", "''")
                updates.append(f"js_content = '{js_esc}'")
            if request_data.title:
                title_esc = request_data.title.replace("'", "''")
                updates.append(f"title = '{title_esc}'")
            if request_data.pages:
                pages_json = json.dumps([p.dict() for p in request_data.pages])
                updates.append(f"pages = '{pages_json}'")
            
            if updates:
                update_query = f"UPDATE websites SET {', '.join(updates)} WHERE slug = '{slug_esc}' AND owner_key = '{owner_esc}'"
                cur.execute(update_query)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Сайт успешно обновлён!'
        })
    }
