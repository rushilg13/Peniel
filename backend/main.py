# Import Modules
from fastapi import FastAPI
# import pickle
from starlette.responses import Response
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import uvicorn
# import requests
from fastapi.responses import FileResponse
# import pymongo
import os
import openai
from openai import OpenAI

# from dotenv import load_dotenv
# Load .env files
# load_dotenv()

os.environ["OPENAI_API_KEY"] = "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"

# Set Middleware
middleware = [ Middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])]

# Set up app
app = FastAPI(middleware=middleware, docs_url=None, redoc_url=None)
client = OpenAI()
# connect to MongoDB
# MONGODB_URI = os.environ.get('MONGODB_URI')
# myclient = pymongo.MongoClient(MONGODB_URI)
# mydb = myclient["GoodNews"]

@app.get('/')
def home():
    messages = [ {"role": "system", "content": ""} ]
    message = "what fields are important for risk scoring of a bank transaction involving US auto loan?"
    if message:
        messages.append(
            {"role": "user", "content": message},
        )
        chat = client.chat.completions.create(
            model="gpt-4o-mini", messages=messages
        )
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")
    messages.append({"role": "assistant", "content": reply})
    return {"is this homepage" : True, "This is chatgpt's reply": reply}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)