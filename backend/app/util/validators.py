import re

def validate_required_fields(data, required_fields):
    return all(field in data and data[field] for field in required_fields)

def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None