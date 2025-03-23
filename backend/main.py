# Import Modules
from fastapi import FastAPI, UploadFile, File, Form
import csv
import io
import pandas as pd
import openpyxl
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
from docx import Document
import fitz

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

messages = [ {"role": "system", "content": "Perform a comprehensive analysis of the provided bank regulatory dataset to ensure compliance with specified rules."} ]

@app.get('/')
def home():
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

@app.post('/upload-dataset')
async def upload_excel_parser(file: UploadFile = File(...)):
    file_extension = file.filename.split(".")[-1]
    if file_extension == 'xlsx':
        contents = file.file.read()
        buffer = io.BytesIO(contents)
        df = pd.read_excel(buffer, engine='openpyxl')
        buffer.close()
        file.file.close()
        print(df.head())
        # csv = df.to_csv(index=False)
        _json = df.to_json()
        messages.append({"role": "user", "content": "This is the dataset in .json format:" + _json + "\n wait for rules to be provided. Just reply with 'Waiting for rules to be entered.' "},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        print(f"ChatGPT: {reply}")
        return({"reply" : reply})
    elif file_extension == 'xls':
        contents = file.file.read()
        buffer = io.BytesIO(contents)
        df = pd.read_excel(buffer)
        buffer.close()
        file.file.close()
        print(df.head())
        messages.append({"role": "user", "content": "This is the dataset in .csv format:" + csv + "\n wait for rules to be provided. Just reply with 'Waiting for rules to be entered.' "},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        print(f"ChatGPT: {reply}")
        return({"reply" : reply})
    elif file_extension == 'csv':
        contents = file.file.read()
        buffer = io.BytesIO(contents)
        df = pd.read_csv(buffer)
        buffer.close()
        file.file.close()
        print(df.head())
        messages.append({"role": "user", "content": "This is the dataset in .csv format:" + csv + "\n wait for rules to be provided. Just reply with 'Waiting for rules to be entered.' "},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        print(f"ChatGPT: {reply}")
        return({"reply" : reply})
    else:
        return "Please upload excel/.csv file."
    return "success"

@app.post('/upload-rules')
async def upload_rules_parser(file: UploadFile = File(None), message: str = Form(None)):
    if message:
        print("Received message:", message)
    else:
        message = ""
    if file:
        extracted_text =""
        file_extension = file.filename.split(".")[-1]
        if file_extension == 'txt':
            extracted_text = file.file.read().decode("utf-8")
        elif file_extension == 'docx':
            doc = Document(file.file._file)
            fullText = []
            for para in doc.paragraphs:
                fullText.append(para.text)
            extracted_text = (fullText)
        elif file_extension == 'pdf':
            contents = await file.read()
            pdf_document = fitz.open(stream=contents, filetype="pdf")
            extracted_text = "\n".join([page.get_text("text") for page in pdf_document])
        else:
            extracted_text = ""
            return "Please upload .txt/.docx/.pdf file."
    else:
        extracted_text = ""
    if message != "" and extracted_text != "":
        messages.append({"role": "user", "content": "These rules are user-defined. Apply these on the dataset uploaded." + message + "These set of rules are extracted from a regulatory dataset, apply these as well on the dataset uploaded" + extracted_text},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        print(f"ChatGPT: {reply}")
        return({"reply":reply})
    elif message == "" and extracted_text != "":
        messages.append({"role": "user", "content": "These set of rules are extracted from a regulatory dataset, apply these on the dataset uploaded" + extracted_text + "Show summary of where data is not aligned with the rules."},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        print(f"ChatGPT: {reply}")
        return({"reply":reply})
    elif message != "" and extracted_text == "":
        messages.append({"role": "user", "content": "These rules are user-defined. Apply these on the dataset uploaded." + message},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        print(f"ChatGPT: {reply}")
        return({"reply":reply})
    return "success"

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)