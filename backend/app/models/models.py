from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary, Text, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from database.database import Base
from app.security.security import verify_password

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    study_set_id = Column(Integer, ForeignKey("study_sets.id"))
    progress = Column(Float, default=0.0)

    user = relationship("User", back_populates="progress")
    study_set = relationship("StudySet", back_populates="progress")

class StudySet(Base):
    __tablename__ = "study_sets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="sets")
    cards = relationship("Flashcard", back_populates="set")
    progress = relationship("UserProgress", back_populates="study_set")

class Flashcard(Base):
    __tablename__ = "flashcards"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, index=True)
    answer = Column(String)
    set_id = Column(Integer, ForeignKey("study_sets.id"))

    set = relationship("StudySet", back_populates="cards")

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    content = Column(LargeBinary, nullable=False)
    extracted_text = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow, server_default="NOW()")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="files")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    sets = relationship("StudySet", back_populates="owner")
    progress = relationship("UserProgress", back_populates="user")
    study_materials = relationship("StudyMaterial", back_populates="user")
    tests = relationship("Test", back_populates="user")
    files = relationship("File", back_populates="user")

    def verify_password(self, plain_password: str) -> bool:
        return verify_password(plain_password, self.hashed_password)

class StudyMaterial(Base):
    __tablename__ = "study_materials"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="study_materials")
    tests = relationship("Test", back_populates="study_material")

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    test_metadata = Column(JSON, nullable=True)

    user = relationship("User", back_populates="tests")
    study_material_id = Column(Integer, ForeignKey("study_materials.id"))
    study_material = relationship("StudyMaterial", back_populates="tests")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float)
    correct = Column(Integer)
    total = Column(Integer)
    submitted_answers = Column(JSON)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    # ✅ Add this
    test_metadata = Column(JSON, nullable=True)

    test = relationship("Test", backref="results")
    user = relationship("User", backref="results")
