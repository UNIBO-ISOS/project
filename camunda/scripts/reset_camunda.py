import requests

host = 'http://localhost:8080/engine-rest/'

body = requests.get(host+'deployment')
keys = [r['id'] for r in body.json()]

print(keys)
params = {'cascade': 'true' }
for key in keys:
    res = requests.delete(host + 'deployment/' + key + '?cascade=true')
    print(res)
