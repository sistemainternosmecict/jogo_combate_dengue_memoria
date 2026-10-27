from django.test import TestCase
from django.urls import reverse
from .models import Ranking
from .serializers import RankingSerializer


class JogoViewsAndRankingTest(TestCase):
    def test_index_page_renders(self):
        response = self.client.get(reverse("index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'id="name"')
        self.assertContains(response, 'onclick="jogar()"')

    def test_jogo_page_renders_with_difficulty_and_exit_modals(self):
        response = self.client.get(reverse("jogo"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'id="modal-dificuldade"')
        self.assertContains(response, 'id="slider-pares"')
        self.assertContains(response, 'min="2"')
        self.assertContains(response, 'max="15"')
        self.assertContains(response, 'onclick="iniciarJogo()"')
        self.assertContains(response, 'id="btn-sair"')
        self.assertContains(response, 'id="modal-sair"')
        self.assertContains(response, 'onclick="sairParaMenu()"')

    def test_ranking_serializer_includes_pares(self):
        serializer = RankingSerializer(
            data={
                "nome": "Teste",
                "pontos": 80,
                "tempo": 45,
                "movimentos": 12,
                "pares": 8,
            }
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["pares"], 8)

    def test_ranking_api_create_and_top10_with_pares(self):
        post_response = self.client.post(
            reverse("ranking"),
            data={
                "nome": "Maria",
                "pontos": 120,
                "tempo": 50,
                "movimentos": 18,
                "pares": 12,
            },
            content_type="application/json",
        )
        self.assertEqual(post_response.status_code, 201)

        top10_response = self.client.get(reverse("top10"))
        self.assertEqual(top10_response.status_code, 200)
        dados = top10_response.json()
        self.assertEqual(len(dados), 1)
        self.assertEqual(dados[0]["nome"], "Maria")
        self.assertEqual(dados[0]["pontos"], 120)
        self.assertEqual(dados[0]["pares"], 12)
