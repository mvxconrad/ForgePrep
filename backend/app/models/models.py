from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from database.database import Base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    sets = relationship("StudySet", back_populates="owner")  # Relationship with Study Sets

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    study_set_id = Column(Integer, ForeignKey("study_sets.id"))
    progress = Column(Float, default=0.0)  # Percentage of completion

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
    content = Column(LargeBinary, nullable=False)  # Stores file data as binary

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
    study_material_id = Column(Integer, ForeignKey("study_materials.id"))
    test_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="tests")
    study_material = relationship("StudyMaterial", back_populates="tests")


