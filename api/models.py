from django.db import models
from django.utils import timezone

class Avis(models.Model):
    qualite_service = models.IntegerField(default=0)
    accueil_personnel = models.IntegerField(default=0)
    rapidite = models.IntegerField(default=0)
    rapport_qualite_prix = models.IntegerField(default=0)
    satisfaction_globale = models.IntegerField(default=0)
    suggestions = models.TextField(blank=True)
    date_creation = models.DateTimeField(default=timezone.now)
    
    class Meta:
        verbose_name = "Avis client"
        verbose_name_plural = "Avis clients"