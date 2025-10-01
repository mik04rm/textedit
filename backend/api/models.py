from django.db import models
from pgvector.django import VectorField


class Conversation(models.Model):
    title = models.CharField(max_length=255)


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )
    role = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Document(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    content = models.TextField()

    def __str__(self):
        return self.title


QWEN3_EMBEDDING_8B_DIM = 4096


class DocumentChunk(models.Model):
    document = models.ForeignKey(
        Document, related_name="chunks", on_delete=models.CASCADE
    )
    chunk_content = models.TextField()
    chunk_index = models.IntegerField()
    qwen3_embedding_8b = VectorField(
        dimensions=QWEN3_EMBEDDING_8B_DIM,
        help_text="Vector embeddings (qwen3_embedding_8b) of the chunk text",
    )
    start_pos = models.IntegerField(null=True)
    end_pos = models.IntegerField(null=True)

    class Meta:
        unique_together = ("document", "chunk_index")
