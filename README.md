# Marulhos — Contador de Reservas/Unidades

Desenvolvido por Caio Vinícius.

Criei essa extensão para resolver uma tarefa que se repetia na rotina: separar as reservas do hotel e do condomínio no Green Software e contar as unidades de cada grupo. Antes, essa conferência era feita manualmente nas tabelas do dashboard.

O painel reúne as contagens por seção, com filtros de grupo e administradora, e calcula a ocupação do condomínio considerando as unidades confirmadas a chegar e as que estão na casa, com base em 225 UHs.

A identificação segue o marcador HOTEL e as administradoras configuradas. Unidades identificadas como CONDOMÍNIO ficam nesse grupo; as demais reservas sem identificação de hotel também. A contagem usa os registros carregados na página, sem alterar os dados do sistema.

Feito com HTML, CSS e JavaScript, sem framework ou dependências. `scan.js` lê as tabelas e `popup.js` cuida do painel e das contagens.

Mais sobre a origem do projeto em [MOTIVACAO.md](MOTIVACAO.md).
