from django.urls import path
from .views import RankingListCreate, listar_ranking

urlpatterns = [
    path("", RankingListCreate.as_view(), name="ranking"),
    path("top10/", listar_ranking, name="top10"),
]