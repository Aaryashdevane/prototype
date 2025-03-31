def format_response(data):
    """
    Utility to format API responses uniformly.
    """
    return {
        "status": "success",
        "count": len(data) if isinstance(data, list) else 1,
        "data": data
    }
