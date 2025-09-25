from django.urls import include, path
from .views import ConversationViewSet, DocumentViewSet, RAGAskAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")
router.register(r"documents", DocumentViewSet, basename="document")

urlpatterns = [
    path("", include(router.urls)),
    path("ask/", RAGAskAPIView.as_view(), name="rag-ask"),
]
