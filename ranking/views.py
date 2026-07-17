from rest_framework import generics
from .models import Ranking
from .serializers import RankingSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response



class RankingListCreate(generics.ListCreateAPIView):
    queryset = Ranking.objects.order_by('-pontos', 'tempo')
    serializer_class = RankingSerializer


@api_view(['GET'])
def listar_ranking(request):

    ranking = Ranking.objects.all().order_by('-pontos')[:10]

    dados = []

    for jogador in ranking:
        dados.append({
            "nome": jogador.nome,
            "pontos": jogador.pontos,
            "tempo": jogador.tempo,
            "movimentos": jogador.movimentos
        })

    return Response(dados)    