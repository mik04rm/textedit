from django.urls import include, path
from .views import ConversationViewSet, DocumentViewSet, ItemsView, RAGAskAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")
router.register(r"documents", DocumentViewSet, basename="document")
# router.register(r"items", ItemsView, basename="item")

urlpatterns = [
    path("", include(router.urls)),
    # path("items/", ItemsView.as_view(), name="items"),
    path("ask/", RAGAskAPIView.as_view(), name="rag-ask"),
]
