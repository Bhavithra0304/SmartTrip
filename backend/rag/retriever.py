import os
import json
import chromadb
from typing import List, Dict, Any
from config import settings
from rag.embeddings import embedding_func
from rag.ingest import init_chroma_db, load_kb_data

class TravelRAGRetriever:
    def __init__(self):
        try:
            self.collection = init_chroma_db()
        except Exception as e:
            print(f"ChromaDB initialization fallback warning: {e}")
            self.collection = None

    def query_knowledge_base(self, query: str, destination: str = "", top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Retrieves relevant travel guides, cultural norms, hidden gems, and safety tips from ChromaDB knowledge base.
        """
        results = []
        full_query = f"{destination} {query}".strip()
        
        if self.collection:
            try:
                query_vec = embedding_func.embed_text(full_query)
                res = self.collection.query(
                    query_embeddings=[query_vec],
                    n_results=top_k
                )
                if res and "documents" in res and res["documents"]:
                    docs = res["documents"][0]
                    metas = res["metadatas"][0] if "metadatas" in res and res["metadatas"] else [{}] * len(docs)
                    ids = res["ids"][0] if "ids" in res and res["ids"] else [""] * len(docs)
                    
                    for doc, meta, doc_id in zip(docs, metas, ids):
                        results.append({
                            "id": doc_id,
                            "title": meta.get("title", "Travel Tip"),
                            "destination": meta.get("destination", "General"),
                            "category": meta.get("category", "General"),
                            "content": doc
                        })
            except Exception as e:
                print(f"RAG Chroma query error: {e}")

        # Fallback keyword match if collection is empty or error
        if not results:
            kb_items = load_kb_data()
            dest_lower = destination.lower()
            q_lower = query.lower()
            
            matched = []
            for item in kb_items:
                item_dest = item["destination"].lower()
                if item_dest == dest_lower or item_dest == "general" or any(w in item["content"].lower() for w in q_lower.split()):
                    matched.append(item)
            
            for item in matched[:top_k]:
                results.append({
                    "id": item["id"],
                    "title": item["title"],
                    "destination": item["destination"],
                    "category": item["category"],
                    "content": f"{item['title']} - {item['content']}"
                })

        return results

retriever = TravelRAGRetriever()
