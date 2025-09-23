## Requirements

- Python 3.13+  
- pip / uv

## Getting started
1. Installing packages and adding packages
```bash
uv sync
source venv/bin/activate  # Linux / MacOS
venv\Scripts\activate     # Windows

uv add <package_name>     # adds package
```

2. Make migrations
```bash
python manage.py migrate
```
3. Run server
```bash
python manage.py runserver
```

