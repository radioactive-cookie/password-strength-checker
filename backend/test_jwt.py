import base64
import json

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydmFmYmx1ZnNjcWJxYmpveHF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMwMDk5MiwiZXhwIjoyMDg5ODc2OTkyfQ.6xcNl6W_lZwnkopuv61-R2n2kx91-YoX7N_OB3SwQH8'

parts = token.split('.')
payload = parts[1]
padding = 4 - (len(payload) % 4)
if padding != 4:
    payload += '=' * padding
    
decoded = base64.urlsafe_b64decode(payload)
payload_json = json.loads(decoded)

print(f'Full payload: {payload_json}')
print(f'Role from JWT: {payload_json.get("role")}')
print(f'Is service_role: {payload_json.get("role") == "service_role"}')
