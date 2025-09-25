from rest_framework import serializers
from .models import Conversation, Item, Message, Document


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "conversation", "role", "content", "created_at"]
        read_only_fields = ["id", "created_at", "conversation"]


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "title", "messages"]


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "title", "content"]
        read_only_fields = ["id"]


class RAGRequestSerializer(serializers.Serializer):
    question = serializers.CharField()
    chat_history = serializers.ListField(
        child=serializers.ListField(
            child=serializers.CharField(),  # Representing Tuple[str, str] as list of 2 strings
            min_length=2,
            max_length=2,
        ),
        default=[],
    )
    doc_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, allow_empty=True
    )


class RAGResponseSerializer(serializers.Serializer):
    answer = serializers.CharField()
    sources = serializers.ListField(child=serializers.CharField())
