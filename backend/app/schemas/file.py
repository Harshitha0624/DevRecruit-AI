from pydantic import BaseModel


class FileResponse(BaseModel):
    id: int
    user_id: int
    original_filename: str
    stored_filename: str
    file_path: str
    file_type: str
    category: str
    file_size: int

    class Config:
        from_attributes = True