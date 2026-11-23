# Política de Privacidade — Green Extension Marulhos

Última atualização: 23 de novembro de 2026.

Esta política descreve o tratamento de dados pela extensão **Green Extension Marulhos**, identificada no pacote como **Marulhos Contador de Reservas/Unidades**, desenvolvida por **Caio Vinícius**, para Microsoft Edge e Google Chrome.

## Finalidade

A extensão auxilia a conferência operacional das unidades do Marulhos no Green Software. Suas funções incluem contar reservas e unidades por grupo, calcular as taxas de ocupação do hotel e do condomínio e identificar fechaduras como **Aproximar** ou **Inserir**.

## Dados acessados e utilizados

Para executar suas funções, a extensão processa informações disponíveis nas páginas do Green Software do Marulhos:

- Números de reservas e identificação das unidades.
- Seções e totais das tabelas de reservas carregadas na página.
- O campo **Inserida por**, que pode conter nomes de pessoas ou administradoras.
- A unidade selecionada no formulário da reserva, para identificar o tipo de fechadura.
- A URL da aba ativa, ao solicitar uma verificação, para confirmar que a página pertence ao Green Software do Marulhos.

A extensão também utiliza as informações fornecidas pelo usuário nas configurações: administradoras para classificação das reservas, unidades com fechadura de aproximação e preferência de exibição do identificador de fechaduras.

O processamento ocorre localmente no navegador. A extensão não consulta o histórico completo de navegação e não solicita login próprio, senhas ou dados de pagamento.

## Acesso às páginas

O identificador de fechaduras funciona nas páginas e nos frames correspondentes aos seguintes endereços:

- `greensoftware.com.br/marulhos/`
- `adm.gbdata.srv.br/marulhos/`

Quando a opção **Mostrar fechadura** está ativada, a extensão acompanha as alterações da página para identificar a unidade da reserva e exibir seu tipo de fechadura. A leitura das tabelas para apresentar as contagens e taxas de ocupação é solicitada pelo botão **Verificar**.

A extensão não altera os registros de reservas nem os dados de chaves do Green Software.

## Armazenamento e retenção

O armazenamento local da extensão guarda:

- A configuração de classificação por administradoras e a lista informada pelo usuário.
- A preferência de exibição das fechaduras.
- Os ajustes locais da lista de unidades com fechadura de aproximação.

Essas configurações permanecem no navegador entre sessões. Não há sincronização entre computadores ou navegadores implementada pela extensão.

Os dados lidos das reservas são utilizados em memória para apresentar os resultados. A extensão não mantém um histórico persistente dessas reservas.

## Transmissão e compartilhamento

A extensão não envia os dados processados ou armazenados a servidores do desenvolvedor nem a terceiros. O desenvolvedor não recebe as reservas, os nomes, as unidades ou as configurações utilizadas no navegador.

A extensão não utiliza serviços de publicidade, ferramentas de análise de uso ou rastreamento. Não vende nem compartilha dados para publicidade, análise de crédito ou finalidades alheias às funções descritas nesta política.

Todos os scripts e a lista inicial de fechaduras estão incluídos no pacote da extensão. Não há carregamento de código remoto.

Esta política se aplica à extensão. O tratamento realizado pelo próprio Green Software e pelas lojas de extensões segue as políticas dos respectivos serviços.

## Controles do usuário

Nas configurações, o usuário pode editar as administradoras, adicionar ou remover unidades da lista de aproximação e ativar ou desativar a exibição das fechaduras.

Desativar **Mostrar fechadura** remove o aviso da página, mas preserva as configurações salvas. Remover uma unidade da lista altera sua classificação; o ajuste pode continuar registrado localmente para substituir a lista inicial do pacote.

Para excluir todas as configurações locais, o usuário pode desinstalar a extensão pelo gerenciador de extensões do navegador. Os dados mantidos no Green Software não são excluídos por essa ação.

## Uso limitado dos dados

O uso das informações fica restrito às funcionalidades descritas nesta política. A extensão observa os requisitos de uso limitado da Política de Dados do Usuário da Chrome Web Store e as regras de privacidade aplicáveis do Microsoft Edge Add-ons.

## Alterações e contato

Esta política será atualizada caso o funcionamento ou o tratamento de dados da extensão seja alterado. A data da última atualização aparece no início do documento.

Para dúvidas sobre a extensão ou esta política, utilize o canal de suporte do desenvolvedor informado na página da extensão na loja.
