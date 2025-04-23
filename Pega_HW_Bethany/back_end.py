
# 1. cd 資料夾路徑
# 2. uvicorn back_end:app --reload 

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from contextlib import asynccontextmanager
import os, json

# JSON 資料路徑
USER_JSON_PATH = "users.json"

# 使用者資料模型
class User(BaseModel):
    id: int
    name: str
    gender: str
    birthday: str
    job: str
    phone: str
    image: str = ""

def load_users():
    if os.path.exists(USER_JSON_PATH):
        with open(USER_JSON_PATH, "r", encoding="utf-8") as f:
            return [User(**u) for u in json.load(f)]
    return []

def save_users(users: List[User]):
    with open(USER_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump([u.dict() for u in users], f, ensure_ascii=False, indent=2)

# 📁 初始化資料夾與載入資料
@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("static/poke_image", exist_ok=True)
    print("📁 資料夾初始化完成")
    global users_db
    # 避免json被誤刪或是沒讀取到的備案
    if not os.path.exists(USER_JSON_PATH):
        users_db = [
            User(id=1, name="皮卡丘", gender="男", birthday="1995-03-01", job="學生", phone="0912-345-678", image="/static/poke_image/皮卡丘.jpg"),
            User(id=2, name="噴火龍", gender="男", birthday="1990-07-21", job="工程師", phone="0987-654-321", image="/static/poke_image/噴火龍.jpg"),
            User(id=3, name="伊布", gender="女", birthday="1988-12-10", job="教師", phone="0966-123-456"),
            User(id=4, name="卡比獸", gender="男", birthday="1983-11-15", job="無業", phone="0933-111-222", image="/static/poke_image/卡比.jpeg"),
            User(id=5, name="傑尼龜", gender="男", birthday="1997-05-05", job="工程師", phone="0900-888-888"),
            User(id=6, name="胖丁", gender="女", birthday="1999-01-25", job="學生", phone="0977-555-444", image="/static/poke_image/胖丁.jpg"),
            User(id=7, name="六尾", gender="女", birthday="1996-06-06", job="教師", phone="0921-333-666"),
            User(id=8, name="耿鬼", gender="男", birthday="1987-09-09", job="無業", phone="0910-444-123"),
            User(id=9, name="可達鴨", gender="男", birthday="1994-04-04", job="工程師", phone="0911-222-333", image="/static/poke_image/可達鴨.jpg"),
            User(id=10, name="呆呆獸", gender="女", birthday="1991-08-08", job="教師", phone="0922-666-777", image="/static/poke_image/呆呆獸.png"),
            User(id=11, name="雷丘", gender="男", birthday="1989-10-10", job="學生", phone="0933-888-999"),
            User(id=12, name="夢幻", gender="女", birthday="1993-12-31", job="無業", phone="0944-123-789")
        ]
        save_users(users_db)
    else:
        users_db = load_users()
    yield
    save_users(users_db)
    print("🔚 App 關閉")

app = FastAPI(lifespan=lifespan)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 靜態檔案掛載
app.mount("/static", StaticFiles(directory="static"), name="static")

# 使用者 API
@app.get("/users", response_model=List[User])
def get_users():
    return users_db

@app.post("/users", response_model=User)
def create_user(user: User):
    if any(u.id == user.id for u in users_db):
        raise HTTPException(status_code=400, detail="User ID already exists")
    users_db.append(user)
    save_users(users_db)
    return user

@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, updated_user: User):
    for index, user in enumerate(users_db):
        if user.id == user_id:
            users_db[index] = updated_user
            save_users(users_db)
            return updated_user
    raise HTTPException(status_code=404, detail="User not found")

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    global users_db
    users_db = [u for u in users_db if u.id != user_id]
    save_users(users_db)
    return {"message": "User deleted successfully"}

# 上傳圖片 API
@app.post("/upload-user")
async def upload_user(
    name: str = Form(...),
    gender: str = Form(...),
    image: UploadFile = File(...)
):
    upload_dir = "static/poke_image"
    os.makedirs(upload_dir, exist_ok=True)

    save_path = os.path.join(upload_dir, image.filename)
    with open(save_path, "wb") as f:
        f.write(await image.read())

    print(f"✅ 圖片已存到：{save_path}")
    return {
        "msg": "成功上傳",
        "image_path": f"/static/poke_image/{image.filename}"
    }