import json
import os
import chromadb
from config import settings
from rag.embeddings import embedding_func

def load_kb_data():
    kb_path = os.path.join(os.path.dirname(__file__), "knowledge_base.json")
    if os.path.exists(kb_path):
        with open(kb_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def init_chroma_db():
    os.makedirs(settings.CHROMA_DB_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)
    collection = client.get_or_create_collection(name="smarttrip_knowledge")
    
    # Check if empty, populate if needed
    if collection.count() == 0:
        docs = load_kb_data()
        if docs:
            ids = [item["id"] for item in docs]
            documents = [f"{item['title']} - {item['content']} (Destination: {item['destination']}, Category: {item['category']})" for item in docs]
            metadatas = [{"destination": item["destination"], "category": item["category"], "title": item["title"]} for item in docs]
            embeddings = embedding_func.embed_documents(documents)
            
            collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas,
                embeddings=embeddings
            )
            print(f"Successfully ingested {len(docs)} documents into ChromaDB 'smarttrip_knowledge'.")
    return collection

if __name__ == "__main__":
    init_chroma_db()
