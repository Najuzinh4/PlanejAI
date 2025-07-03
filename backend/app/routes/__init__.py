from .ai import router as ai_router
router.include_router(ai_router, prefix="/api")
