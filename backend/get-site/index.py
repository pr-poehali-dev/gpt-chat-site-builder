import json
import os
from typing import Dict, Any
import psycopg

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get published website by slug and return rendered HTML
    Args: event with httpMethod, queryStringParameters; context with request_id
    Returns: Full HTML page with embedded CSS and JS
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': '<h1>Method not allowed</h1>'
        }
    
    params = event.get('queryStringParameters', {}) or {}
    slug = params.get('slug', '')
    
    if not slug:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': '<h1>Slug parameter required</h1>'
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': '<h1>Database not configured</h1>'
        }
    
    escaped_slug = slug.replace("'", "''")
    
    with psycopg.connect(database_url, autocommit=True) as conn:
        with conn.cursor() as cur:
            query = f"SELECT html_content, css_content, js_content FROM websites WHERE slug = '{escaped_slug}' AND published = true"
            cur.execute(query)
            result = cur.fetchone()
    
    if not result:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': '''
            <!DOCTYPE html>
            <html>
            <head><title>404</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 100px;">
                <h1>404 - Сайт не найден</h1>
                <p>Проверьте правильность ссылки</p>
            </body>
            </html>
            '''
        }
    
    html_content, css_content, js_content = result
    
    full_page = f'''<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Published Site</title>
    <style>{css_content}</style>
</head>
<body>
    {html_content if html_content.strip().startswith('<') else f'<div>{html_content}</div>'}
    <script>{js_content}</script>
</body>
</html>'''
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': full_page
    }