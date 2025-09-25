from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action

from llm.embedding import get_embedding_model
from .models import QWEN3_EMBEDDING_8B_DIM, Conversation, Document, DocumentChunk, Item
from .serializers import (
    ConversationSerializer,
    ItemSerializer,
    DocumentSerializer,
    MessageSerializer,
)

from vector_db.content import chunk_text


class ItemsView(APIView):
    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    @action(detail=True, methods=["post"])
    def add_message(self, request, pk=None):
        conversation = self.get_object()
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(conversation=conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def perform_create(self, serializer):
        print("debug: start")
        # Save the document first
        document = serializer.save()

        chunks = chunk_text(document.content)

        embedding_model = get_embedding_model()

        print("debug: embedding_model")

        assert (
            len(embedding_model.embed_query("test")) == QWEN3_EMBEDDING_8B_DIM
        ), "Embedding dimension mismatch"
        # Save chunks
        for index, chunk_content in enumerate(chunks):
            DocumentChunk.objects.create(
                document=document,
                chunk_content=chunk_content,
                chunk_index=index,
                qwen3_embedding_8b=embedding_model.embed_query(chunk_content),
            )
