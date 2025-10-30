from fastapi import APIRouter
from .health import router as health_router
from .ai import router as ai_router
from .subject import router as subject_router
from .plano import router as planos_router
from .auth import router as auth_router

router = APIRouter()
router.include_router(health_router)
router.include_router(subject_router)
router.include_router(ai_router)
router.include_router(planos_router)
router.include_router(auth_router)

