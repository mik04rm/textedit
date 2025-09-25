from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action

from llm.embedding import get_embedding_model
from .models import QWEN3_EMBEDDING_8B_DIM, Conversation, Document, DocumentChunk
from .serializers import (
    ConversationSerializer,
    DocumentSerializer,
    MessageSerializer,
    RAGRequestSerializer,
    RAGResponseSerializer,
)

from rag.chunk_text import chunk_text
from rag.graph import RAGState, rag_chain


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
        document = serializer.save()

        chunks = chunk_text(document.content)

        embedding_model = get_embedding_model()

        assert (
            len(embedding_model.embed_query("test")) == QWEN3_EMBEDDING_8B_DIM
        ), "Embedding dimension mismatch"

        for index, chunk_content in enumerate(chunks):
            DocumentChunk.objects.create(
                document=document,
                chunk_content=chunk_content,
                chunk_index=index,
                qwen3_embedding_8b=embedding_model.embed_query(chunk_content),
            )


class RAGAskAPIView(APIView):
    def post(self, request):
        serializer = RAGRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        assert isinstance(validated_data, dict)  # TODO find some better stubs?

        state: RAGState = {
            "question": validated_data["question"],
            "doc_ids": validated_data.get("doc_ids"),
            "top_k": 1,  # TEMPORARY FOR TESTING
            "docs": [],
            "answer": "",
        }

        result = rag_chain.invoke(state)

        response_data = {
            "answer": result.get("answer", ""),
            "sources": [d for d in result.get("docs", [])],
        }

        response_serializer = RAGResponseSerializer(response_data)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
