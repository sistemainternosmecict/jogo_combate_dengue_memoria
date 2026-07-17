# 🦟 Jogo da Memória - Combate à Dengue

##  Sobre o Projeto

O **Jogo da Memória - Combate à Dengue** é um jogo educativo desenvolvido com o objetivo de ensinar crianças e usuários em geral sobre a importância da prevenção contra a dengue de uma forma simples, interativa e divertida.

Durante o jogo, o usuário deve encontrar pares de cartas relacionadas ao combate ao mosquito **Aedes aegypti**, enquanto aprende informações importantes sobre prevenção, sintomas e cuidados necessários para evitar a proliferação da doença.

---

## Objetivos

- Desenvolver um jogo educativo e interativo;
- Auxiliar na conscientização sobre a dengue;
- Ensinar medidas de prevenção de forma lúdica;
- Estimular memória, atenção e aprendizado.

---

## Funcionalidades

 Tela inicial com cadastro do nome do jogador;

 Jogo da memória com cartas temáticas;

 Contagem de:
- Pontuação;
- Tempo de partida;
- Quantidade de movimentos;

 Mensagens educativas ao encontrar cartas;

 Sistema de ranking dos melhores jogadores;

 Salvamento dos resultados em banco de dados;

 Interface simples e amigável para crianças.

---

##  Tecnologias Utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript

### Back-end

- Python
- Django
- Django REST Framework

### Banco de Dados

- PostgreSQL

### Ferramentas

- Visual Studio Code
- Git e GitHub

---

##  Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/sistemainternosmecict/jogo_combate_dengue_memoria.git
```

---

### 2. Configurar o ambiente Python

Criar um ambiente virtual:

```bash
pip install uv
```

Instalar as dependências:

```bash
uv sync
```

---

### 3. Configurar o banco de dados

Criar o banco PostgreSQL local e
Configurar as informações no arquivo:

```
settings.py
```

Executar as migrações:

```bash
uv run python manage.py migrate
```

---

### 4. Iniciar o servidor Django

Antes de rodar configure um arquivo .env na raiz do projeto para configurar as variaveis de ambiente usadas pelo servidor seguindo o seguinte modelo:

```env
DJANGO_SECRET=1234
DB_NAME="meudb"
DB_USER="meuusuario"
DB_PASSWORD="minhasenha"
DB_HOST="localhost"
```

Inicie a pasta estatica

```bash
uv run python3 manage.py collectstatic --noinput
```

E inicie o servidor

```bash
uv run granian --interface wsgi config.wsgi:application --port 8000
```

O sistema estará disponível em:

```
http://127.0.0.1:8000/
```

---

##  Sistema de Ranking

Ao finalizar uma partida, os dados do jogador são enviados para a API Django contendo:

- Nome do jogador;
- Pontuação;
- Tempo utilizado;
- Quantidade de movimentos.

Exemplo de registro:

```
Nome: Igor
Pontos: 106
Tempo: 116 segundos
Movimentos: 45
```

---

##  Funcionamento do Jogo

O jogador inicia informando seu nome e recebe um conjunto de cartas viradas.

Cada carta representa um elemento relacionado à dengue, como:

🦟 Mosquito Aedes aegypti
🚰 Caixa d'água
🛞 Pneus acumulando água
🪣 Baldes
🗑️ Lixo acumulado
💧 Água parada

O objetivo é encontrar todos os pares no menor tempo e com o menor número de movimentos possível.

---

## Aprendizados

Durante o desenvolvimento foram aplicados conhecimentos de:

- Desenvolvimento Front-end;
- Manipulação do DOM com JavaScript;
- Criação de APIs REST;
- Integração Front-end e Back-end;
- Modelagem de banco de dados;
- Versionamento utilizando Git;
- Desenvolvimento de sistemas educativos.

---

## Autores

**Igor da Silva Azeredo**,
**Angel Daumas pereira Lopez,**
**Thyéz de Oliveira Monteiro**

Projeto desenvolvido para fins educacionais.

---

## 📄 Licença

Este projeto está disponível para estudos e melhorias.
