# Café Aroma Supremo

Este projeto apresenta um website moderno e responsivo para uma cafeteria premium, "Café Aroma Supremo". Ele foi desenvolvido com foco em uma experiência de usuário elegante, animações sutis e um sistema de pedidos simplificado, incluindo integração com WhatsApp.

## Funcionalidades

*   **Design Orgânico e Premium:** Estilo visual sofisticado com paleta de cores terrosas, fontes elegantes e formas orgânicas.
*   **Animações Suaves:** Utiliza GSAP (GreenSock Animation Platform) e ScrollTrigger para animações de entrada de elementos e efeitos de parallax, proporcionando uma experiência de navegação dinâmica.
*   **Menu de Navegação Responsivo:** Barra de navegação fixa com efeito de rolagem e um menu mobile deslizante (`drawer`) para dispositivos menores.
*   **Efeito de Vapor de Café em Canvas:** Uma animação sutil de vapor sobre a imagem principal da seção Hero, criada com JavaScript puro para otimização de performance.
*   **Sistema de Carrinho Híbrido:**
    *   Adicione itens do menu ao carrinho.
    *   Atualize quantidades ou remova itens diretamente do carrinho.
    *   Visualização em tempo real do total do pedido.
    *   **Integração com WhatsApp:** Geração de um link direto para o WhatsApp com o resumo do pedido preenchido automaticamente, facilitando o contato para pedidos.
    *   Simulação de checkout para demonstração de fluxo de e-commerce.
*   **Iconografia:** Utiliza a biblioteca Phosphor Icons para ícones vetoriais leves.
*   **Fontes Personalizadas:** Integração com Google Fonts para "Playfair Display" (serifada) e "Inter" (sans-serif).

## Tecnologias Utilizadas

*   **HTML5:** Estrutura semântica do conteúdo.
*   **CSS3:** Estilização e responsividade (com variáveis CSS e media queries).
*   **JavaScript (ES6+):** Lógica interativa do site, gerenciamento do carrinho e animações do canvas.
*   **GSAP (GreenSock Animation Platform):** Biblioteca avançada para animações web de alta performance.
*   **ScrollTrigger (GSAP Plugin):** Para animações baseadas na rolagem da página.
*   **Phosphor Icons:** Biblioteca de ícones.
*   **Google Fonts:** Para as tipografias personalizadas.

## Estrutura do Projeto

```
.
├── app.js
├── index.html
└── style.css
```

*   `index.html`: Arquivo principal HTML que estrutura o conteúdo da página.
*   `style.css`: Contém todas as regras CSS para estilização e layout.
*   `app.js`: Contém a lógica JavaScript para as interações, animações e o sistema de carrinho.

## Como Executar o Projeto

Para visualizar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório** (se aplicável, ou baixe os arquivos):
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd beans-and-brews-cafe
    ```
    (Nota: Como este é um projeto local, você pode simplesmente abrir o `index.html`.)

2.  **Abra o arquivo `index.html`** em seu navegador web preferido.

O projeto é totalmente estático e não requer um servidor web ou dependências de Node.js para ser executado.

