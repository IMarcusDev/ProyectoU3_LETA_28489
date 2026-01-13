from fastapi import FastAPI

from src.routes.transaction_routes import router as transaction_router

app = FastAPI(
  title="Transactions API",
  version="1.0.0"
)

@app.get("/")
def health_check():
  return {"status": "ok"}

app.include_router(transaction_router)
