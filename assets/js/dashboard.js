$(document).ready(function() {
	var elementoAtual = null;
	var imagensDeletadas = [];
	var novasImagens = [];
	var imagensTrocadas = [];

	$(".btn-editar").click(function() {
		elementoAtual = $(this).closest(".card-noticias");
		codigo_noticia = elementoAtual.find("input[type='hidden']").val();

		$.get(baseURL+"usuario/dashboard/informacoes-noticia", {codigo: codigo_noticia}, function(resultado) {

			if (resultado == "Usuário não autorizado")
				print('');

			else {
				dados = JSON.parse(resultado);

				abrirModalEdicaoPreenchido(dados);				
			}
		})
	});

	$('.btn-excluir').click(function() {
		codigo_noticia = $(this).closest(".card-noticias").find("input[type='hidden']").val();

		swal({
			title: 'Confirmar exclusão',
			text: 'Você realmente deseja excluir essa notícia permanentemente ?',
			icon: 'warning',
			buttons: {
				Sim: {
					text: 'Sim',
					value: true
				},
				Nao: {
					text: 'Não',
					value: false
				},
			}
		}).then((fazerExclusao) => {
			var cardNoticia = $(this).closest('.card-noticias');

			if (fazerExclusao) {
				$.post(baseURL+'usuario/dashboard/remover-noticia', {codigo: codigo_noticia}, function(resultado) {
					if (resultado == 'success') {
						swal({
							title: 'Exclusão Realizada',
							text: 'A notícia selecionada foi excluida com sucesso',
							icon: 'success',
							button: 'Ok'
						});

						cardNoticia.remove();

					}
					else if (resultado == 'error') {
						swal({
							title: 'Erro na exclusão',
							text: 'Não foi possivel realizar a exclusão, por favor tente novamente',
							icon: 'warning',
							button: 'Ok'
						});
					}

				});
			}
		});
	});

	$("#form-edita-noticia").submit(function(event) {
		event.preventDefault();

		var dados = $('#form-edita-noticia').serialize();

		$.post(baseURL+'usuario/dashboard/editar-noticia', dados, function(resultado) {
			if (resultado == 'error')
				swal({
					title: 'Erro na edição',
					text: 'Não foi possivel realizar a modificação, por favor tente novamente',
					icon: 'warning',
					button: 'Ok'
				});

			else {
				const novosDados = JSON.parse(resultado);
				atualizarNoticia(novosDados);

				$('#modal-editar').modal('hide');

				swal({
					title: 'Modificação realizada',
					text: 'Edição realizada com sucesso !',
					icon: 'success',
					button: 'Ok'
				});
			}
		});
	});

	function abrirModalEdicaoPreenchido(dados) {
		$("#titulo").val(dados['titulo']);
		$("#subtitulo").val(dados['subtitulo']);
		$("#noticia").val(dados['noticia']);
		$("#codigo-noticia").val(codigo_noticia);
		$('#noticia').froalaEditor('html.set', dados['noticia']);

		$('#modal-editar').modal('show');

		const imagensNoticia = $(".fr-view img");
		removerTodosSlidesCarrossel();

		for (const imagem of imagensNoticia)
			adicionaImagemCarrossel($(imagem).attr('src'));

		// Se chamar apenas a função sem usar esse delay de 1s a função não funciona corretamente
		setTimeout(submeterComoSlideAtual, 1000, dados['imagemCapa']);
	}

	function atualizarNoticia(dados) {
		const titulo = dados['titulo'];
		const subtitulo = dados['subtitulo'];
		const data = dados['dataEdicao'];

		elementoAtual.find('.titulo a').text(titulo);
		elementoAtual.find('.subtitulo').text(subtitulo);
		elementoAtual.find('.data-noticia').text(data);
	}
});