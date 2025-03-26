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
#import pymongo
import os
import openai
from openai import OpenAI
from docx import Document
import fitz
import json
import numpy as np
import ast
# from dotenv import load_dotenv
# Load .env files
# load_dotenv()

# os.environ["OPENAI_API_KEY"] = "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"

# os.environ["OPENAI_API_KEY"] = "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"

# os.environ["OPENAI_API_KEY"] = "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"

# os.environ["OPENAI_API_KEY"] = "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"

# os.environ["OPENAI_API_KEY"] = "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"

# os.environ["OPENAI_API_KEY"] = "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"

# os.environ["OPENAI_API_KEY"] = "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"

os.environ["OPENAI_API_KEY"] = "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"

# Set Middleware
middleware = [ Middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])]

# Set up app
app = FastAPI(middleware=middleware, docs_url=None, redoc_url=None)
client = OpenAI()

# connect to MongoDB
# MONGODB_URI = "mongodb://localhost:27017"
# myclient = pymongo.MongoClient(MONGODB_URI)
# mydb = myclient["chat"]

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

#### FIX THIS - CORS
@app.post('/upload-dataset')
async def upload_excel_parser(file: UploadFile = File(...)):
    file_extension = file.filename.split(".")[-1]
    home_directory = os.path.expanduser("~")
    downloads_folder = os.path.join(home_directory, "Downloads")
    file_path = f"{downloads_folder}\\Hackathon\\Saved/{file.filename}"  ### FIXED THIS Make dynamic
    with open(file_path, "wb") as f:
        f.write(file.file.read())
        print("file saved.")
    if file_extension == 'xlsx':
        # contents = file.file.read()
        # buffer = io.BytesIO(contents)
        # # print(buffer)
        df = pd.read_excel(f"{downloads_folder}\\Hackathon\\Saved/{file.filename}", engine='openpyxl')
        print(df)
        # buffer.close()
        file.file.close()
        cols = df.columns
        _json = df.to_json()
        data = json.loads(_json)
        result = []
        for i in range(len(df)):
            res = {}
            for col in cols:
                res[col] = dict(data[col])[str(i)]
            result.append(res)
        # print(str(result))
        with open("input_data.txt", 'w', encoding='unicode-escape') as f:
            f.write(str(result))
        
        messages.append({"role": "user", "content": "This is the dataset in json format:" + str(result) + "\n wait for rules to be provided. Just reply with 'Waiting for rules to be entered.' "},)
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

        print("Received file.")
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
        messages.append({"role": "user", "content": "These set of rules are extracted from a regulatory dataset, apply these as well on the dataset uploaded" + extracted_text + "\n. " + message + ".\nOnly show where the rules failed and why they failed and how to remediate it in 3 bullet points."},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        messages.append({"role": "user", "content": "for all rows of data, Based on your observation, create a json file consisting of 'Transaction ID' and the additional fields based on the following rules. add a field to the dataset called 'flag'. Set flag to 0 if all the required fields exist and the values match the rules. Set flag to 1 if all required fields exist but any of the value is not in accordance with the rules. Set flag to 2 if any of the required fields are missing. Share the file in .json format as a response with no other text, Just the output dataset." + "If flag is set to 1, then add a field called 'failing rules' and populate it with all the rules that failed. Add another field called 'Remediation' and populate it with remediation steps for failing rules" + 
        "If flag is set to 2, then add a field called 'Missing Fields' and populate it with the fields that are missing values. Please recehck the data against the mentioned rules to avoid errors at all cost."},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        _json_ = chat.choices[0].message.content
        # print(f"ChatGPT: {reply}")
        _json_ = _json_.replace("`", '')
        _json_ = _json_.replace("json", "")
        # print(_json_)
        home_directory = os.path.expanduser("~")
        downloads_folder = os.path.join(home_directory, "Downloads")
        og_df = pd.read_excel(f"{downloads_folder}\\Hackathon\\Saved\\test.xlsx", engine='openpyxl')
        # print(og_df.head())
        og_df["flag"] = np.nan
        og_df["failing rules"] = np.nan
        og_df["remediation"] = np.nan
        og_df["missing fields"] = np.nan
        # print(og_df.head())
        _json_ = ast.literal_eval(_json_)
        print(_json_)
        for i in range(len(_json_)):
            # print("\n\n\n" + _json_)
            doc = _json_[i]
            # print(type(doc))
            for k, v in doc.items():
                trans_id = doc["Transaction ID"]
                df_idx = og_df.index[og_df['Transaction ID'] == trans_id]
                if k == "flag":
                    flag = doc["flag"]
                    og_df.loc[df_idx, ["flag"]] = int(flag)
                elif k == "failing rules":
                    og_df.loc[df_idx, ["failing rules"]] = str(v)
                    # og_df.loc[og_df['Transaction ID'] == trans_id, 'failing rules'] = str(v)
                    # og_df['failing rules'] = np.where(og_df['Transaction ID'] == trans_id, str(v))
                elif k == "Remediation":
                    og_df.loc[df_idx, ["remediation"]] = str(v)
                    # og_df.loc[og_df['Transaction ID'] == trans_id, 'remediation'] = str(v)
                    # og_df['remediation'] = np.where(og_df['Transaction ID'] == trans_id, str(v))
                elif k == "Missing Fields":
                    og_df.loc[df_idx, ["missing fields"]] = str(v)
                    # og_df.loc[og_df['Transaction ID'] == trans_id, 'missing fields'] = str(v)
                    # og_df['missing fields'] = np.where(og_df['Transaction ID'] == trans_id, str(v))
            # failing_rules = doc["failing rules"]
            # rem = doc["remediation"]
            # og_df["missing fields"]
        # print(og_df.head())
        csv_buffer = io.StringIO()
        og_df.to_csv(csv_buffer, index=False)
        csv_string = csv_buffer.getvalue()
        return({"reply":reply, "df" : csv_string})
    
    elif message == "" and extracted_text != "":
        messages.append({"role": "user", "content": "These set of rules are extracted from a regulatory dataset, apply these on the dataset uploaded" + extracted_text + ".\nOnly show where the rules failed and why they failed and how to remediate it in 3 bullet points."},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        # messages.append({"role": "user", "content": "Based on your observation, add a field to the dataset inputted by user called 'flag'. After your analysis, for each record add value of 'flag' as 0 if the record aligns with the inputted rules, else 1. Also add 3 more fields to the dataset 'which field'. And share back the file in .csv format as a response. No other text in response needed. Just the updated dataset with new 'flag' column along with values for each record."},)
        messages.append({"role": "user", "content": "for all rows of data, Based on your observation, create a json file consisting of 'Transaction ID' and the additional fields based on the following rules. add a field to the dataset called 'flag'. Set flag to 0 if all the required fields exist and the values match the rules. Set flag to 1 if all required fields exist but any of the value is not in accordance with the rules. Set flag to 2 if any of the required fields are missing. Share the file in .json format as a response with no other text, Just the output dataset." + "If flag is set to 1, then add a field called 'failing rules' and populate it with all the rules that failed. Add another field called 'Remediation' and populate it with remediation steps for failing rules" + 
        "If flag is set to 2, then add a field called 'Missing Fields' and populate it with the fields that are missing values. Please recehck the data against the mentioned rules to avoid errors at all cost."},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        _json_ = chat.choices[0].message.content
        # print(f"ChatGPT: {reply}")
        _json_ = _json_.replace("`", '')
        _json_ = _json_.replace("json", "")
        # print(_json_)
        home_directory = os.path.expanduser("~")
        downloads_folder = os.path.join(home_directory, "Downloads")
        og_df = pd.read_excel(f"{downloads_folder}\\Hackathon\\Saved\\test.xlsx", engine='openpyxl')

        # print(og_df.head())
        og_df["flag"] = np.nan
        og_df["failing rules"] = np.nan
        og_df["remediation"] = np.nan
        og_df["missing fields"] = np.nan
        # print(og_df.head())
        _json_ = ast.literal_eval(_json_)

        for i in range(len(_json_)):
            # print("\n\n\n" + _json_)
            doc = _json_[i]
            # print(type(doc))
            for k, v in doc.items():
                trans_id = doc["Transaction ID"]
                df_idx = og_df.index[og_df['Transaction ID'] == trans_id]
                if k == "flag":
                    flag = doc["flag"]
                    og_df.loc[df_idx, ["flag"]] = int(flag)
                elif k == "failing rules":
                    og_df.loc[df_idx, ["failing rules"]] = str(v)
                    # og_df.loc[og_df['Transaction ID'] == trans_id, 'failing rules'] = str(v)
                    # og_df['failing rules'] = np.where(og_df['Transaction ID'] == trans_id, str(v))
                elif k == "Remediation":
                    og_df.loc[df_idx, ["remediation"]] = str(v)
                    # og_df.loc[og_df['Transaction ID'] == trans_id, 'remediation'] = str(v)
                    # og_df['remediation'] = np.where(og_df['Transaction ID'] == trans_id, str(v))
                elif k == "Missing Fields":
                    og_df.loc[df_idx, ["missing fields"]] = str(v)
                    # og_df.loc[og_df['Transaction ID'] == trans_id, 'missing fields'] = str(v)
                    # og_df['missing fields'] = np.where(og_df['Transaction ID'] == trans_id, str(v))
            # failing_rules = doc["failing rules"]
            # rem = doc["remediation"]
            # og_df["missing fields"]
        # print(og_df.head())
        csv_buffer = io.StringIO()
        og_df.to_csv(csv_buffer, index=False)
        csv_string = csv_buffer.getvalue()
        return({"reply":reply, "df" : csv_string})
    ###### FIX THIS #######################333
    elif message != "" and extracted_text == "":
        messages.append({"role": "user", "content": message},)
        chat = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        print(f"ChatGPT: {reply}")
        return({"reply":reply})

@app.get('/pie-chart')
def pie_chart():
    pass

@app.get('/reset-session')
def reset():
    pass

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
