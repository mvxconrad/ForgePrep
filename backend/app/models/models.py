from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from datetime import datetime
from sqlalchemy.orm import relationship
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    study_materials = relationship("StudyMaterial", back_populates="user")
    tests = relationship("Test", back_populates="user")


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

