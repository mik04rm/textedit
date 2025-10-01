from typing import Dict


def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[Dict]:
    result = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunk_content = text[start:end]
        result.append({
            "content": chunk_content,
            "start_pos": start,
            "end_pos": end,
        })

        start = end - chunk_overlap

        if end == text_len:
            break

    return result