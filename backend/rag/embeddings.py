import math
from typing import List

class SimpleEmbeddingFunction:
    """
    Lightweight, high-performance vector embedding generator using term-frequency and character n-grams.
    Ensures zero external API dependency or heavy model download issues.
    """
    def __init__(self, vector_dim: int = 64):
        self.vector_dim = vector_dim

    def embed_text(self, text: str) -> List[float]:
        vec = [0.0] * self.vector_dim
        words = text.lower().split()
        if not words:
            return vec
            
        for idx, word in enumerate(words):
            for char_idx, char in enumerate(word):
                hash_val = (ord(char) * (idx + 1) * 31 + char_idx * 17) % self.vector_dim
                vec[hash_val] += 1.0
                
        # Normalize L2 norm
        norm = math.sqrt(sum(val * val for val in vec))
        if norm > 0:
            vec = [round(val / norm, 5) for val in vec]
        return vec

    def embed_documents(self, documents: List[str]) -> List[List[float]]:
        return [self.embed_text(doc) for doc in documents]

embedding_func = SimpleEmbeddingFunction()
