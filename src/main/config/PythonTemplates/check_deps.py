import sys
import json

deps = {
    'python': float('{}.{}'.format(sys.version_info[0], sys.version_info[1])),
    'aiohttp': False,
    'tabpy': False
}

try:
    import aiohttp
    deps['aiohttp'] = True
except:
    pass

try:
    import tabpy
    deps['tabpy'] = True
except:
    pass

print(json.dumps(deps))