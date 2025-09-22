from django.db import models


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


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
