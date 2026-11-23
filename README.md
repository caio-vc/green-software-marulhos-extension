# Extensão GreenSoftware Marulhos — Contador de Reservas/Unidades

Desenvolvido por Caio Vinícius.

Criei essa extensão para resolver uma tarefa que se repetia na rotina: separar as reservas do hotel e do condomínio no Green Software e contar as unidades de cada grupo. Antes, essa conferência era feita manualmente nas tabelas do dashboard.

O painel reúne as contagens por seção, com filtros de grupo e administradora, e calcula a ocupação do condomínio e do hotel considerando as unidades confirmadas a chegar e as que estão na casa. A base é de 231 UHs para o condomínio e 69 apartamentos para o hotel.

A identificação segue o marcador HOTEL e as administradoras configuradas. Unidades com os nomes RESTAURANTE, ADMINISTRAÇÃO, TESTE, CONDOMÍNIO ou HOTEL são sempre classificadas como hotel, independentemente do marcador e da configuração de administradoras. A comparação ignora acentos, maiúsculas e minúsculas e espaços extras. As demais reservas sem identificação de hotel ficam no condomínio. A contagem usa os registros carregados na página, sem alterar os dados do sistema.

## Identificação de fechaduras

Na engrenagem, ative **Mostrar fechadura**. Ao abrir uma reserva, a extensão mostra **APROXIMAR** ou **INSERIR** abaixo de **Chaves permitidas**, de acordo com a unidade selecionada. Não é necessário clicar em Verificar. O aviso acompanha a troca da unidade e a abertura de reservas na mesma página, inclusive em frames do Green.

A lista inicial fica em `locks.json` e contém apenas **306A** como Aproximar para o primeiro teste. Qualquer unidade fora da lista usa Inserir.

Abra **Gerenciar unidades** para acessar o campo e os botões. Para cadastrar, informe uma ou mais unidades separadas por vírgula (por exemplo, `306A, 402A, BGL01`) e clique em **Adicionar**. O botão **Remover** também aceita várias unidades. Unidades repetidas são tratadas uma única vez; se alguma estiver inválida, nenhuma alteração é salva até a correção. Toda unidade cadastrada usa Aproximar. Para corrigir um cadastro, digite a unidade no mesmo campo e clique em **Remover**; ela volta a usar Inserir. As alterações e a opção de visualização ficam no armazenamento local da extensão e persistem ao fechar o navegador. Cada navegador mantém seu próprio cadastro; não há sincronização entre computadores. Remover a extensão também remove esse cadastro local.

O identificador consulta a unidade nos campos do bloco da reserva. Caso não encontre uma unidade válida ou encontre unidades diferentes no mesmo bloco, não exibe um tipo de fechadura, para evitar associar o aviso à reserva errada. Não altera as chaves permitidas nem os dados da locação no Green.

### Instalação e teste

1. Extraia o ZIP e carregue a pasta que contém `manifest.json` em **Carregar sem compactação**, na página de extensões do Chrome ou Edge (modo de desenvolvedor).
2. Se estiver atualizando, substitua os arquivos na pasta já carregada e clique em **Recarregar** na extensão. Use a mesma instalação para preservar as configurações locais.
3. Atualize a página do Green para carregar o identificador.
4. Na engrenagem da extensão, ative **Mostrar fechadura** e abra uma locação da **306A**: o aviso deve ser **APROXIMAR**. Uma unidade fora da lista deve mostrar **INSERIR**.
5. Cadastre uma unidade como Aproximar e confira a atualização na reserva. Digite a mesma unidade e clique em **Remover** para confirmar o retorno a Inserir. Desligue a visualização para conferir a remoção do aviso.

O fluxo de fechar e abrir a reserva foi inspecionado na tela real do Green. O identificador lê também a unidade exibida no Select2 (`#s2id_locacao_unidade .select2-chosen`). Os testes incluem a estrutura observada no formulário, carregamento dinâmico e atualizações contínuas da página, que não devem adiar o aviso indefinidamente.

Feito com HTML, CSS e JavaScript, sem framework ou dependências em produção. `scan.js` lê as tabelas e `popup.js` cuida do painel e das contagens. `lock-data.js` reúne a lista inicial e as alterações locais, `lock-settings.js` cuida do cadastro e `locks.js` exibe o identificador na reserva.

Mais sobre a origem do projeto em [MOTIVACAO.md](MOTIVACAO.md).
