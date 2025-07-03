from .subjects import router as subjects_router
router.include_router(subjects_router, prefix="/api")
