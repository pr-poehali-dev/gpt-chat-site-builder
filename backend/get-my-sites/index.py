import json
import os
from typing import Dict, Any
import psycopg

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get all websites owned by specific owner key
    Args: event with httpMethod, queryStringParameters; context with request_id
    Returns: List of owned websites
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
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {}) or {}
    owner_key = params.get('owner_key', '')
    
    if not owner_key:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'owner_key parameter required'})
        }
    
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
    
    owner_esc = owner_key.replace("'", "''")
    
    with psycopg.connect(database_url, autocommit=True) as conn:
        with conn.cursor() as cur:
            query = f"SELECT id, title, slug, custom_domain, created_at, pages FROM websites WHERE owner_key = '{owner_esc}' ORDER BY created_at DESC"
            cur.execute(query)
            results = cur.fetchall()
    
    websites = []
    for row in results:
        website_id, title, slug, custom_domain, created_at, pages = row
        websites.append({
            'id': website_id,
            'title': title,
            'slug': slug,
            'custom_domain': custom_domain,
            'created_at': created_at.isoformat() if created_at else None,
            'pages': pages if pages else [],
            'url': f"https://{custom_domain}" if custom_domain else f"https://functions.poehali.dev/5dd0b84c-6c65-4ef4-bbf3-57de039b0294?slug={slug}"
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'websites': websites,
            'total': len(websites)
        })
    }
